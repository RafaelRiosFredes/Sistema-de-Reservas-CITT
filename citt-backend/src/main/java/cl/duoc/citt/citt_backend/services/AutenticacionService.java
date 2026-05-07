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
import cl.duoc.citt.citt_backend.model.RecuperarPasswordToken;
import cl.duoc.citt.citt_backend.repositories.RecuperarPasswordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Logica central de autenticacion.
 *
 * Gestiona el ciclo de vida del usuario:
 *      Registro
 *      Login
 *      Seguridad
 *      Recuperación
 *
 * Se implementa un sistema de 3 capas de tokens para máxima seguridad.
 */
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
    private final RecuperarPasswordRepository passwordRecuperarRepository;

    @Value("${app.dominios.alumno:@duocuc.cl}")
    private String dominioAlumno;
    @Value("${app.dominios.docente:@profesor.duoc.cl}")
    private String dominioDocente;
    @Value("${app.dominios.manual:@duoc.cl}")
    private String dominioManual;


    /**
     * REGISTRO MANUAL: Un administrador crea a otro usuario.
     */
    public RegistroResponseDTO registrar(RegistroRequestDTO solicitud) {
        // Validar que los campos básicos no vengan nulos
        if (solicitud.getEmail() == null || solicitud.getRolesNombres() == null || solicitud.getRolesNombres().isEmpty()) {
            throw new ReglaNegocioException("Faltan datos obligatorios: email y roles");
        }

        // Verificar que el correo pertenezca a @duocuc.cl, @profesor.duoc.cl o @duoc.cl
        validarCorreoInstitucional(solicitud.getEmail());

        // El email debe ser único en la BD
        if (usuarioRepository.findByEmail(solicitud.getEmail()).isPresent()) {
            throw new ReglaNegocioException("El correo electrónico ya se encuentra registrado");
        }

        // Convertir los nombres de roles (String) a entidades Rol de la BD
        Set<Rol> roles = solicitud.getRolesNombres().stream()
                .map(nombre -> rolRepository.findByNombre(nombre.toUpperCase())
                        .orElseThrow(() -> new ReglaNegocioException("Error: El rol " + nombre + " no existe")))
                .collect(Collectors.toSet());

        // Generar una clave temporal de 8 caracteres
        String passwordProvisoria = UUID.randomUUID().toString().substring(0, 8);

        // Construir el nuevo usuario
        var usuario = Usuario.builder()
                .email(solicitud.getEmail())
                .password(passwordEncoder.encode(passwordProvisoria)) // Guardar clave encriptada (Bcrypt)
                .roles(roles)
                .debeCambiarPassword(true) // Forzar cambio de clave al entrar
                .build();
        usuarioRepository.save(usuario);

        // Enviar la clave por email al usuario
        emailService.enviarPasswordProvisoria(usuario.getEmail(), passwordProvisoria);

        return RegistroResponseDTO.builder()
                .mensaje("Usuario registrado exitosamente. Se ha enviado la clave provisoria.")
                .email(usuario.getEmail())
                .roles(usuario.getRoles().stream().map(Rol::getNombre).collect(Collectors.toSet()))
                .build();
    }

    /**
     * AUTO-REGISTRO:
     * <p>
     * Permite a alumnos y docentes crear su propia cuenta.
     * El sistema asigna el rol automáticamente según el dominio del correo.
     */
    public RegistroResponseDTO autoRegistrar(AutoRegistroRequestDTO solicitud) {
        if (solicitud.getEmail() == null || solicitud.getEmail().isBlank()) {
            throw new ReglaNegocioException("El correo electrónico es obligatorio");
        }

        if (usuarioRepository.findByEmail(solicitud.getEmail()).isPresent()) {
            throw new ReglaNegocioException("El correo electrónico ya se encuentra registrado");
        }

        // Detectar si es ALUMNO o DOCENTE mirando el dominio
        String rolDetectado = detectarRolPorDominio(solicitud.getEmail());

        Rol rol = rolRepository.findByNombre(rolDetectado)
                .orElseThrow(() -> new ReglaNegocioException("Error interno: el rol no existe en la BD"));

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
                .mensaje("¡Cuenta creada! Revisa tu correo para tu clave provisoria.")
                .email(usuario.getEmail())
                .roles(Set.of(rolDetectado))
                .build();
    }

    /**
     * LOGIN: Valida credenciales y entrega los tokens de sesión.
     * Entrega un Access Token (JWT corto) y un Refresh Token (largo y persistente).
     */
    public AutenticacionResponseDTO iniciarSesion(InicioSesionRequestDTO solicitud) {
        // Spring Security valida el correo y la contraseña contra la BD
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(solicitud.getEmail(), solicitud.getPassword())
        );

        var usuario = usuarioRepository.findByEmail(solicitud.getEmail())
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));

        // Generar los 2 tokens de sesión
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

    /**
     * RENOVACION DE SESION: Usa un Refresh Token para obtener un nuevo Access Token.
     */
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
                .orElseThrow(() -> new ReglaNegocioException("Token de refresco inválido o expirado"));
    }

    /**
     * LOGOUT: Elimina el Refresh Token de la BD.
     */
    public void cerrarSesion(String authHeader) {
        String email = null;
        var auth = SecurityContextHolder.getContext().getAuthentication();

        // Obtener el usuario actual desde el contexto de Spring o del Header Bearer
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            email = auth.getName();
        } else if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            email = jwtUtilidades.extraerUsernameInclusoSiExpirado(token);
        }

        if (email == null) throw new ReglaNegocioException("Sesión no identificada");

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));

        // Borrar el token de la BD para cerrar la sesión físicamente
        refreshTokenService.eliminarPorUsuario(usuario.getId());
    }

    /**
     * CAMBIO DE CLAVE: El usuario cambia su clave.
     */
    public void cambiarPassword(CambioPasswordRequestDTO solicitud) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));

        // Verificar que la clave actual sea correcta antes de cambiarla
        if (!passwordEncoder.matches(solicitud.getPasswordActual(), usuario.getPassword())) {
            throw new ReglaNegocioException("La contraseña actual es incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(solicitud.getNuevaPassword()));
        usuario.setDebeCambiarPassword(false);
        usuarioRepository.save(usuario);
    }

    /**
     * RECUPERACIÓN PASO 1: Generar Token de Reseteo.
     * No cambia la clave del usuario aún, solo envía un código temporal.
     */
    @Transactional
    public void solicitarRecuperacionPassword(OlvidoPasswordRequestDTO solicitud) {
        Usuario usuario = usuarioRepository.findByEmail(solicitud.getEmail())
                .orElseThrow(() -> new ReglaNegocioException("Si el correo existe, recibirás instrucciones."));

        // Limpiar intentos de recuperación anteriores
        passwordRecuperarRepository.deleteByUsuario(usuario);

        // Generar un UUID (código largo y seguro) y tiene 30 min de vida
        String token = UUID.randomUUID().toString();
        RecuperarPasswordToken resetToken = RecuperarPasswordToken.builder()
                .token(token)
                .usuario(usuario)
                .fechaExpiracion(LocalDateTime.now().plusMinutes(30))
                .build();

        passwordRecuperarRepository.save(resetToken);

        // Envia el codigo por email
        emailService.enviarPasswordRecuperacion(usuario.getEmail(), token);
    }

    /**
     * RECUPERACIÓN PASO 2: Validar Código y Cambiar Clave.
     * Usa el "codigoRecuperacion" para identificar al usuario y autorizar el cambio.
     */
    @Transactional
    public void resetearPassword(RecuperarPasswordRequestDTO solicitud) {
        // Buscar el token enviado en la tabla de recuperación
        RecuperarPasswordToken resetToken = passwordRecuperarRepository.findByToken(solicitud.getCodigoRecuperacion())
                .orElseThrow(() -> new ReglaNegocioException("El código de recuperación es inválido o no existe"));

        // Validar que el token no haya pasado los 30 minutos
        if (resetToken.estaExpirado()) {
            passwordRecuperarRepository.delete(resetToken);
            throw new ReglaNegocioException("El código de recuperación ha expirado");
        }

        // Si el token es válido, obtenemos al usuario y actualizamos su clave definitiva
        Usuario usuario = resetToken.getUsuario();
        usuario.setPassword(passwordEncoder.encode(solicitud.getNuevaPassword()));
        usuario.setDebeCambiarPassword(false);
        usuarioRepository.save(usuario);

        // Eliminar el token usado por seguridad (solo se usa una vez)
        passwordRecuperarRepository.delete(resetToken);
        // También cerramos sesiones activas
        refreshTokenService.eliminarPorUsuario(usuario.getId());
    }

    /**
     * Lógica para asignar roles automáticamente según el dominio de email.
     */
    private String detectarRolPorDominio(String email) {
        String dominio = email.substring(email.lastIndexOf("@")).toLowerCase();

        if (dominio.equals(dominioAlumno)) return "ALUMNO";
        if (dominio.equals(dominioDocente)) return "DOCENTE";
        if (dominio.equals(dominioManual)) {
            throw new ReglaNegocioException("Correos " + dominioManual + " requieren registro manual por un Coordinador.");
        }

        throw new ReglaNegocioException("Dominio no institucional.");
    }

    /**
     *Solo se permiten los roles ALUMNO y DOCENTE en el auto-registro.
     * Los usuarios con rol COORDINADOR o DIRECTOR deben registrarse de forma manual SIEMPRE. */


     // Validación estricta de dominios permitidos.
    private void validarCorreoInstitucional(String email) {
        String dominio = email.substring(email.lastIndexOf("@")).toLowerCase();
        if (!dominio.equals("@duocuc.cl") && !dominio.equals("@profesor.duoc.cl") && !dominio.equals("@duoc.cl")) {
            throw new ReglaNegocioException("Solo se permiten correos de la institución.");
        }
    }
}
