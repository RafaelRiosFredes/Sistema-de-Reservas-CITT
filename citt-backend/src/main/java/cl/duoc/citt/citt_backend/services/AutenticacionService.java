package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.*;
import cl.duoc.citt.citt_backend.model.RefreshToken;
import cl.duoc.citt.citt_backend.model.Rol;
import cl.duoc.citt.citt_backend.model.Usuario;
import cl.duoc.citt.citt_backend.repositories.RolRepository;
import cl.duoc.citt.citt_backend.repositories.UsuarioRepository;
import cl.duoc.citt.citt_backend.security.JwtUtilidades;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.repositories.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AutenticacionService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtilidades jwtUtilidades;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;

    public RegistroResponseDTO registrar(RegistroRequestDTO solicitud) {
        if (solicitud.getEmail() == null || solicitud.getRolesNombres() == null || solicitud.getRolesNombres().isEmpty()) {
            throw new ReglaNegocioException("Faltan datos obligatorios: email y roles");
        }

        validarCorreoInstitucional(solicitud.getEmail());

        if(usuarioRepository.findByEmail(solicitud.getEmail()).isPresent()) {
            throw new ReglaNegocioException("El correo electrónico ya se encuentra registrado");
        }

        Set<Rol> roles = solicitud.getRolesNombres().stream()
                .map(nombre -> rolRepository.findByNombre(nombre.toUpperCase())
                        .orElseThrow(() -> new ReglaNegocioException("Error: El rol " + nombre + " no existe")))
                .collect(Collectors.toSet());

        String passwordProvisoria = UUID.randomUUID().toString().substring(0, 8);

        var usuario = Usuario.builder()
                .email(solicitud.getEmail())
                .password(passwordEncoder.encode(passwordProvisoria))
                .roles(roles)
                .debeCambiarPassword(true)
                .build();
        usuarioRepository.save(usuario);

        emailService.enviarPasswordProvisoria(usuario.getEmail(), passwordProvisoria);

        return RegistroResponseDTO.builder()
                .mensaje("Usuario registrado exitosamente. Se ha enviado la contraseña provisoria al correo.")
                .email(usuario.getEmail())
                .roles(usuario.getRoles().stream().map(Rol::getNombre).collect(Collectors.toSet()))
                .build();
    }

    public RegistroResponseDTO autoRegistrar(AutoRegistroRequestDTO solicitud) {
        if (solicitud.getEmail() == null || solicitud.getEmail().isBlank()) {
            throw new ReglaNegocioException("El correo electrónico es obligatorio");
        }

        if (usuarioRepository.findByEmail(solicitud.getEmail()).isPresent()) {
            throw new ReglaNegocioException("El correo electrónico ya se encuentra registrado");
        }

        String rolDetectado = detectarRolPorDominio(solicitud.getEmail());

        Rol rol = rolRepository.findByNombre(rolDetectado)
                .orElseThrow(() -> new ReglaNegocioException("Error interno: el rol " + rolDetectado + " no existe en la base de datos"));

        String passwordProvisoria = UUID.randomUUID().toString().substring(0, 8);

        var usuario = Usuario.builder()
                .email(solicitud.getEmail())
                .password(passwordEncoder.encode(passwordProvisoria))
                .roles(Set.of(rol))
                .debeCambiarPassword(true)
                .build();
        usuarioRepository.save(usuario);

        emailService.enviarPasswordProvisoria(usuario.getEmail(), passwordProvisoria);

        return RegistroResponseDTO.builder()
                .mensaje("¡Cuenta creada exitosamente! Revisa tu correo para obtener tu contraseña provisoria.")
                .email(usuario.getEmail())
                .roles(Set.of(rolDetectado))
                .build();
    }

    public AutenticacionResponseDTO iniciarSesion(InicioSesionRequestDTO solicitud) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(solicitud.getEmail(), solicitud.getPassword())
        );

        var usuario = usuarioRepository.findByEmail(solicitud.getEmail())
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));

        var tokenJwt = jwtUtilidades.generarToken(usuario);
        var refreshToken = refreshTokenService.crearRefreshToken(usuario.getId());

        return AutenticacionResponseDTO.builder()
                .token(tokenJwt)
                .refreshToken(refreshToken.getToken())
                .email(usuario.getEmail())
                .roles(usuario.getRoles().stream().map(Rol::getNombre).collect(Collectors.toSet()))
                .debeCambiarPassword(usuario.isDebeCambiarPassword())
                .build();
    }

    @Transactional
    public AutenticacionResponseDTO refrescarToken(TokenRefreshRequestDTO solicitud) {
        return refreshTokenRepository.findByToken(solicitud.getRefreshToken())
                .map(refreshTokenService::verificarExpiracion)
                .map(RefreshToken::getUsuario)
                .map(usuario -> {
                    String token = jwtUtilidades.generarToken(usuario);
                    var nuevoRefreshToken = refreshTokenService.crearRefreshToken(usuario.getId());

                    return AutenticacionResponseDTO.builder()
                            .token(token)
                            .refreshToken(nuevoRefreshToken.getToken())
                            .email(usuario.getEmail())
                            .roles(usuario.getRoles().stream().map(Rol::getNombre).collect(Collectors.toSet()))
                            .debeCambiarPassword(usuario.isDebeCambiarPassword())
                            .build();
                })
                .orElseThrow(() -> new ReglaNegocioException("El Refresh Token no existe o ya fue utilizado"));
    }

    public void cerrarSesion(String authHeader) {
        String email = null;
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            email = auth.getName();
        } else if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            email = jwtUtilidades.extraerUsernameInclusoSiExpirado(token);
        }

        if (email == null) {
            throw new ReglaNegocioException("No se pudo identificar al usuario para cerrar sesión");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));

        refreshTokenService.eliminarPorUsuario(usuario.getId());
    }

    public void cambiarPassword(CambioPasswordRequestDTO solicitud) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));

        if (!passwordEncoder.matches(solicitud.getPasswordActual(), usuario.getPassword())) {
            throw new ReglaNegocioException("La contraseña actual es incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(solicitud.getNuevaPassword()));
        usuario.setDebeCambiarPassword(false);
        usuarioRepository.save(usuario);
    }

    private String detectarRolPorDominio(String email) {
        String dominio = email.substring(email.lastIndexOf("@")).toLowerCase();

        return switch (dominio) {
            case "@duocuc.cl" -> "ALUMNO";
            case "@profesor.duoc.cl" -> "DOCENTE";
            case "@duoc.cl" -> throw new ReglaNegocioException(
                    "Los correos @duoc.cl no pueden auto-registrarse. Contacte a un COORDINADOR o DIRECTOR para que le cree una cuenta.");
            default -> throw new ReglaNegocioException(
                    "Dominio de correo no válido. Solo se permiten: @duocuc.cl, @profesor.duoc.cl");
        };
    }

    private void validarCorreoInstitucional(String email) {
        String dominio = email.substring(email.lastIndexOf("@")).toLowerCase();
        if (!dominio.equals("@duocuc.cl") && !dominio.equals("@profesor.duoc.cl") && !dominio.equals("@duoc.cl")) {
            throw new ReglaNegocioException(
                    "Correo no institucional. Solo se permiten: @duocuc.cl, @profesor.duoc.cl, @duoc.cl");
        }
    }

    @Transactional
    public void solicitarRecuperacionPassword(OlvidoPasswordRequestDTO solicitud) {
        Usuario usuario = usuarioRepository.findByEmail(solicitud.getEmail())
                .orElseThrow(() -> new ReglaNegocioException("Si el correo está registrado, recibirás un correo en breve."));

        String passwordTemporal = UUID.randomUUID().toString().substring(0, 8);

        usuario.setPassword(passwordEncoder.encode(passwordTemporal));
        usuario.setDebeCambiarPassword(true);
        usuarioRepository.save(usuario);

        refreshTokenService.eliminarPorUsuario(usuario.getId());

        emailService.enviarPasswordRecuperacion(usuario.getEmail(), passwordTemporal);
    }

    @Transactional
    public void resetearPassword(RecuperarPasswordRequestDTO solicitud) {
        Usuario usuario = usuarioRepository.findByEmail(solicitud.getEmail())
                .orElseThrow(() -> new ReglaNegocioException("El email o la contraseña provisoria son incorrectos"));

        if (!passwordEncoder.matches(solicitud.getPasswordProvisoria(), usuario.getPassword())) {
            throw new ReglaNegocioException("El email o la contraseña provisoria son incorrectos");
        }

        usuario.setPassword(passwordEncoder.encode(solicitud.getNuevaPassword()));
        usuario.setDebeCambiarPassword(false);
        usuarioRepository.save(usuario);

        refreshTokenService.eliminarPorUsuario(usuario.getId());
    }
}
