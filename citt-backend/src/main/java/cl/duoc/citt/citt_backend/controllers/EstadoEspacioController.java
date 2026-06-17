package cl.duoc.citt.citt_backend.controllers;


import cl.duoc.citt.citt_backend.model.EstadoEspacio;
import cl.duoc.citt.citt_backend.services.EstadoEspacioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estado-espacio")
@RequiredArgsConstructor
public class EstadoEspacioController {

    private final EstadoEspacioService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<EstadoEspacio> crear(@RequestBody EstadoEspacio estado) {
        return ResponseEntity.ok(service.crear(estado));
    }

    // Cualquier usuario autenticado puede ver la información
    @GetMapping
    public ResponseEntity<List<EstadoEspacio>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    // Cualquier usuario autenticado puede ver la información
    @GetMapping("/{id}")
    public ResponseEntity<EstadoEspacio> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<EstadoEspacio> actualizar(@PathVariable Long id,
                                                    @RequestBody EstadoEspacio estado) {
        return ResponseEntity.ok(service.actualizar(id, estado));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
