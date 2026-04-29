package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.*;
import cl.duoc.citt.citt_backend.model.Rol;
import cl.duoc.citt.citt_backend.model.Usuario;
import cl.duoc.citt.citt_backend.repositories.RolRepository;
import cl.duoc.citt.citt_backend.repositories.UsuarioRepository;
import cl.duoc.citt.citt_backend.security.JwtUtilidades;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    /**
     * Proceso de Registro:
     * 1. Valida que el correo coincida con el rol (ej: Alumno debe ser @duocuc.cl).
     * 2. Verifica si el usuario ya existe.
     * 3. Genera una contraseña aleatoria y temporal.
     * 4. Guarda al usuario y envía la clave por email.
     */

    public RegistroResponseDTO registrar(RegistroRequestDTO solicitud) {
        // Validar dominios de correo según cada rol
        solicitud.getRolesNombres().forEach(nombre ->
                validarDominioCorreo(solicitud.getEmail(), nombre.toUpperCase())
        );

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

        // Generar el "ticket" de acceso (JWT)
        var tokenJwt = jwtUtilidades.generarToken(usuario);
        return new AutenticacionResponseDTO(
                tokenJwt,
                usuario.getEmail(),
                usuario.getRoles().stream().map(Rol::getNombre).collect(Collectors.toSet()),
                usuario.isDebeCambiarPassword()
        );
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

    // Filtra qué correos pueden tener qué cargos.
    private void validarDominioCorreo(String email, String rolNombre) {
        String dominio = email.substring(email.lastIndexOf("@"));

        switch (rolNombre) {
            case "ALUMNO":
            case "AYUDANTE":
                if (!dominio.equalsIgnoreCase("@duocuc.cl")) {
                    throw new ReglaNegocioException("Correo inválido para ALUMNO/AYUDANTE. Debe usar @duocuc.cl");
                }
                break;
            case "DOCENTE":
                if (!dominio.equalsIgnoreCase("@profesor.duoc.cl")) {
                    throw new ReglaNegocioException("Correo inválido para DOCENTE. Debe usar @profesor.duoc.cl");
                }
                break;
            case "DIRECTOR":
            case "COORDINADOR":
                if (!dominio.equalsIgnoreCase("@duoc.cl")) {
                    throw new ReglaNegocioException("Correo inválido para DIRECTOR/COORDINADOR. Debe usar @duoc.cl");
                }
                break;
        }
    }
}
