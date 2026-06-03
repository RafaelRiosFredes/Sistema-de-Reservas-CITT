package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.model.Rol;
import cl.duoc.citt.citt_backend.model.Usuario;
import cl.duoc.citt.citt_backend.repositories.RolRepository;
import cl.duoc.citt.citt_backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Crear roles si no existen
        List.of("COORDINADOR", "DIRECTOR", "DOCENTE", "AYUDANTE", "ALUMNO").forEach(nombre -> {
            if (rolRepository.findByNombre(nombre).isEmpty()) {
                rolRepository.save(Rol.builder().nombre(nombre).build());
            }
        });

        // Crear usuario inicial (Director + Coordinador) para probar multi-rol
        if (usuarioRepository.findByEmail("admin@duoc.cl").isEmpty()) {
            Rol rolDirector = rolRepository.findByNombre("DIRECTOR")
                    .orElseThrow(() -> new RuntimeException("Error: Rol DIRECTOR no encontrado"));
            Rol rolCoordinador = rolRepository.findByNombre("COORDINADOR")
                    .orElseThrow(() -> new RuntimeException("Error: Rol COORDINADOR no encontrado"));

            Usuario admin = Usuario.builder()
                    .email("admin@duoc.cl")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(rolDirector, rolCoordinador))
                    .debeCambiarPassword(false)
                    .build();
            usuarioRepository.save(admin);
            System.out.println(">>> Usuario inicial MULTI-ROL creado: admin@duoc.cl / admin123");
        }

        // Crear usuario ALUMNO + AYUDANTE para probar multi-rol de estudiante
        if (usuarioRepository.findByEmail("alumno@duocuc.cl").isEmpty()) {
            Rol rolAlumno = rolRepository.findByNombre("ALUMNO")
                    .orElseThrow(() -> new RuntimeException("Error: Rol ALUMNO no encontrado"));
            Rol rolAyudante = rolRepository.findByNombre("AYUDANTE")
                    .orElseThrow(() -> new RuntimeException("Error: Rol AYUDANTE no encontrado"));

            Usuario alumno = Usuario.builder()
                    .email("alumno@duocuc.cl")
                    .password(passwordEncoder.encode("alumno123"))
                    .roles(Set.of(rolAlumno, rolAyudante))
                    .debeCambiarPassword(false)
                    .build();
            usuarioRepository.save(alumno);
            System.out.println(">>> Usuario ALUMNO+AYUDANTE creado: alumno@duocuc.cl / alumno123");
        }

        // Crear usuario DOCENTE + COORDINADOR para probar multi-rol de profesor
        if (usuarioRepository.findByEmail("profesor@profesor.duoc.cl").isEmpty()) {
            Rol rolDocente = rolRepository.findByNombre("DOCENTE")
                    .orElseThrow(() -> new RuntimeException("Error: Rol DOCENTE no encontrado"));
            Rol rolCoordinador2 = rolRepository.findByNombre("COORDINADOR")
                    .orElseThrow(() -> new RuntimeException("Error: Rol COORDINADOR no encontrado"));

            Usuario profesor = Usuario.builder()
                    .email("profesor@profesor.duoc.cl")
                    .password(passwordEncoder.encode("profesor123"))
                    .roles(Set.of(rolDocente, rolCoordinador2))
                    .debeCambiarPassword(false)
                    .build();
            usuarioRepository.save(profesor);
            System.out.println(">>> Usuario DOCENTE+COORDINADOR creado: profesor@profesor.duoc.cl / profesor123");
        }
    }
}