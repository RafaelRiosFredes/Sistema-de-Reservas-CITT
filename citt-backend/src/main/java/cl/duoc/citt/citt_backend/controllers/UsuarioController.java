package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.UsuarioResponseDTO;
import cl.duoc.citt.citt_backend.dto.UsuarioUpdateDTO;
import cl.duoc.citt.citt_backend.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    // Cualquier usuario autenticado puede ver su propia información
    @GetMapping("/mi-perfil")
    public ResponseEntity<UsuarioResponseDTO> miPerfil() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(usuarioService.buscarPorEmail(email));
    }

    // Lista completa de usuarios registrados. Solo COORDINADOR y DIRECTOR
    @GetMapping
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    // Actualiza los datos de un usuario específico. Solo COORDINADOR y DIRECTOR
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<UsuarioResponseDTO> actualizar(@PathVariable Long id,
            @RequestBody UsuarioUpdateDTO solicitud) {
        return ResponseEntity.ok(usuarioService.actualizar(id, solicitud));
    }

    // Busca un usuario por su ID. Solo COORDINADOR y DIRECTOR
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    // Elimina a un usuario del sistema de forma definitiva. Solo COORDINADOR y DIRECTOR
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
