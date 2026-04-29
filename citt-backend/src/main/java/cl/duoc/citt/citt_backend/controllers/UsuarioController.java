package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.UsuarioResponseDTO;
import cl.duoc.citt.citt_backend.dto.UsuarioUpdateDTO;
import cl.duoc.citt.citt_backend.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    //Lista completa de usuarios registrados.
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    //Actualiza los datos de un usuario específico
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizar(@PathVariable Long id, @RequestBody UsuarioUpdateDTO solicitud) {
        return ResponseEntity.ok(usuarioService.actualizar(id, solicitud));
    }

    // Elimina a un usuario del sistema de forma definitiva.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
