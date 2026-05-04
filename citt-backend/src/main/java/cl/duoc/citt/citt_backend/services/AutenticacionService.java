package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.*;
import cl.duoc.citt.citt_backend.dto.AutoRegistroRequestDTO;
import cl.duoc.citt.citt_backend.model.Rol;
import cl.duoc.citt.citt_backend.model.Usuario;
import cl.duoc.citt.citt_backend.repositories.RolRepository;
import cl.duoc.citt.citt_backend.repositories.UsuarioRepository;
import cl.duoc.citt.citt_backend.security.JwtUtilidades;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.model.RefreshToken;
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

    /**
     * Proceso de Registro:
     * 1. Valida que el correo coincida con el rol (ej: Alumno debe ser @duocuc.cl).
     * 2. Verifica si el usuario ya existe.
     * 3. Genera una contraseña aleatoria y temporal.
     * 4. Guarda al usuario y envía la clave por email.
     */

    public RegistroResponseDTO registrar(RegistroRequestDTO solicitud) {
        // Validaciones preventivas para evitar Error 500
        if (solicitud.getEmail() == null || solicitud.getRolesNombres() == null || solicitud.getRolesNombres().isEmpty()) {
            throw new ReglaNegocioException("Faltan datos obligatorios: email y roles");
        }

        // Validar que el correo sea institucional (cualquier dominio DuocUC)
        // Un admin puede asignar cualquier rol a cualquier correo institucional
        validarCorreoInstitucional(solicitud.getEmail());

        // Error si el correo ya está en uso
        if(usuarioRepository.findByEmail(solicitud.getEmail()).isPresent()) {
            throw new ReglaNegocioException("El correo electrónico ya se encuentra registrado");
        }

        // Buscar los roles en la BD; si uno no existe, lanza error
        Set<Rol> roles = solicitud.getRolesNombres().stream()
                .map(nombre -> rolRepository.findByNombre(nombre.toUpperCase())
                        .orElseThrow(() -> new ReglaNegocioException("Error: El rol " + nombre + " no existe")))
                .collect(Collectors.toSet());

        // // Generar clave aleatoria de 8 caracteres
        String passwordProvisoria = UUID.randomUUID().toString().substring(0, 8);

        var usuario = Usuario.builder()
                .email(solicitud.getEmail())
                .password(passwordEncoder.encode(passwordProvisoria))
                .roles(roles)
                .debeCambiarPassword(true) // para obligar al cambio en el primer login
                .build();
        usuarioRepository.save(usuario);

        // Envío de correo asíncrono con la clave generada
        emailService.enviarPasswordProvisoria(usuario.getEmail(), passwordProvisoria);

        return RegistroResponseDTO.builder()
                .mensaje("Usuario registrado exitosamente. Se ha enviado la contraseña provisoria al correo.")
                .email(usuario.getEmail())
                .roles(usuario.getRoles().stream().map(Rol::getNombre).collect(Collectors.toSet()))
                .build();
    }

    /**
     * Auto-Registro Público:
     * Permite a cualquier usuario crear su propia cuenta ingresando solo su correo.
     * El rol se detecta automáticamente según el dominio del email.
     * Los dominios @duoc.cl (DIRECTOR/COORDINADOR) NO están permitidos aquí por seguridad.
     */
    public RegistroResponseDTO autoRegistrar(AutoRegistroRequestDTO solicitud) {
        if (solicitud.getEmail() == null || solicitud.getEmail().isBlank()) {
            throw new ReglaNegocioException("El correo electrónico es obligatorio");
        }

        // Verificar que el correo no esté ya registrado
        if (usuarioRepository.findByEmail(solicitud.getEmail()).isPresent()) {
            throw new ReglaNegocioException("El correo electrónico ya se encuentra registrado");
        }

        // Detectar el rol automáticamente según el dominio del correo
        String rolDetectado = detectarRolPorDominio(solicitud.getEmail());

        // Buscar el rol en la BD
        Rol rol = rolRepository.findByNombre(rolDetectado)
                .orElseThrow(() -> new ReglaNegocioException("Error interno: el rol " + rolDetectado + " no existe en la base de datos"));

        // Generar clave aleatoria de 8 caracteres
        String passwordProvisoria = UUID.randomUUID().toString().substring(0, 8);

        var usuario = Usuario.builder()
                .email(solicitud.getEmail())
                .password(passwordEncoder.encode(passwordProvisoria))
                .roles(Set.of(rol))
                .debeCambiarPassword(true)
                .build();
        usuarioRepository.save(usuario);

        // Enviar la contraseña provisoria por correo
        emailService.enviarPasswordProvisoria(usuario.getEmail(), passwordProvisoria);

        return RegistroResponseDTO.builder()
                .mensaje("¡Cuenta creada exitosamente! Revisa tu correo para obtener tu contraseña provisoria.")
                .email(usuario.getEmail())
                .roles(Set.of(rolDetectado))
                .build();
    }

    /**
     * Proceso de Login:
     * 1. Autentica las credenciales con Spring Security.
     * 2. Si son válidas, genera un token JWT con la info del usuario.
     */

    public AutenticacionResponseDTO iniciarSesion(InicioSesionRequestDTO solicitud) {
        // Valida email y password. Si fallan, Spring lanza una excepción automáticamente
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        solicitud.getEmail(),
                        solicitud.getPassword()
                )
        );

        var usuario = usuarioRepository.findByEmail(solicitud.getEmail())
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));

        // Generar el Access Token (JWT)
        var tokenJwt = jwtUtilidades.generarToken(usuario);

        // Generar o actualizar el Refresh Token
        var refreshToken = refreshTokenService.crearRefreshToken(usuario.getId());

        return AutenticacionResponseDTO.builder()
                .token(tokenJwt)
                .refreshToken(refreshToken.getToken())
                .email(usuario.getEmail())
                .roles(usuario.getRoles().stream().map(Rol::getNombre).collect(Collectors.toSet()))
                .debeCambiarPassword(usuario.isDebeCambiarPassword())
                .build();
    }

    /**
     * Refresca el Access Token usando un Refresh Token válido.
     * Implementa 'Refresh Token Rotation': genera un nuevo refresh token y borra el usado.
     */
    @Transactional
    public AutenticacionResponseDTO refrescarToken(TokenRefreshRequestDTO solicitud) {
        return refreshTokenRepository.findByToken(solicitud.getRefreshToken())
                .map(refreshTokenService::verificarExpiracion)
                .map(RefreshToken::getUsuario)
                .map(usuario -> {
                    // 1. Generar nuevo Access Token
                    String token = jwtUtilidades.generarToken(usuario);

                    // 2. ROTACIÓN: Generar un nuevo Refresh Token y borrar el anterior
                    var nuevoRefreshToken = refreshTokenService.crearRefreshToken(usuario.getId());

                    return AutenticacionResponseDTO.builder()
                            .token(token)
                            .refreshToken(nuevoRefreshToken.getToken()) // Enviamos el nuevo token
                            .email(usuario.getEmail())
                            .roles(usuario.getRoles().stream().map(Rol::getNombre).collect(Collectors.toSet()))
                            .debeCambiarPassword(usuario.isDebeCambiarPassword())
                            .build();
                })
                .orElseThrow(() -> new ReglaNegocioException("El Refresh Token no existe o ya fue utilizado"));
    }

    /**
     * Cierra la sesión del usuario eliminando su Refresh Token de la base de datos.
     * Soporta cerrar sesión incluso si el JWT ya ha expirado.
     */
    public void cerrarSesion(String authHeader) {
        String email = null;

        // 1. Intentar obtener el email desde el contexto de seguridad (si el token es válido)
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            email = auth.getName();
        }
        // 2. Si no hay auth (token expirado), extraerlo manualmente del header
        else if (authHeader != null && authHeader.startsWith("Bearer ")) {
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


    /**
     * Cambio de contraseña:
     * 1. Identifica al usuario logueado mediante el contexto de seguridad.
     * 2. Compara la clave actual.
     * 3. Encripta y guarda la nueva clave, quitando la obligación de cambio.
     */

    public void cambiarPassword(CambioPasswordRequestDTO solicitud) {
        // Obtener el email del usuario que está haciendo la petición
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));

        // Verificar que la clave actual coincida con la de la BD
        if (!passwordEncoder.matches(solicitud.getPasswordActual(), usuario.getPassword())) {
            throw new ReglaNegocioException("La contraseña actual es incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(solicitud.getNuevaPassword()));
        usuario.setDebeCambiarPassword(false);
        usuarioRepository.save(usuario);
    }


    /**
     * Detecta automáticamente el rol según el dominio del correo.
     * Se usa solo en el auto-registro público.
     * Los dominios administrativos (@duoc.cl) están bloqueados por seguridad.
     */
    private String detectarRolPorDominio(String email) {
        String dominio = email.substring(email.lastIndexOf("@")).toLowerCase();

        return switch (dominio) {
            case "@duocuc.cl" -> "ALUMNO";
            case "@profesor.duoc.cl" -> "DOCENTE";
            case "@duoc.cl" -> throw new ReglaNegocioException(
                    "Los correos @duoc.cl no pueden auto-registrarse. " +
                            "Contacte a un COORDINADOR o DIRECTOR para que le cree una cuenta.");
            default -> throw new ReglaNegocioException(
                    "Dominio de correo no válido. Solo se permiten: @duocuc.cl, @profesor.duoc.cl");
        };
    }

    /**
     * Valida que el correo sea de un dominio institucional DuocUC.
     * Se usa en el registro por admin: permite cualquier rol con cualquier correo institucional.
     * Ejemplo: un @profesor.duoc.cl puede ser DOCENTE + COORDINADOR.
     */
    private void validarCorreoInstitucional(String email) {
        String dominio = email.substring(email.lastIndexOf("@")).toLowerCase();
        if (!dominio.equals("@duocuc.cl") && !dominio.equals("@profesor.duoc.cl") && !dominio.equals("@duoc.cl")) {
            throw new ReglaNegocioException(
                    "Correo no institucional. Solo se permiten: @duocuc.cl, @profesor.duoc.cl, @duoc.cl");
        }
    }
}
