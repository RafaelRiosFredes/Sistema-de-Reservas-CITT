package cl.duoc.citt.citt_backend.controllers;


import cl.duoc.citt.citt_backend.model.EstadoEspacio;
import cl.duoc.citt.citt_backend.services.EstadoEspacioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estado-espacio")
@RequiredArgsConstructor
public class EstadoEspacioController {

    private final EstadoEspacioService service;

    @PostMapping
    public ResponseEntity<EstadoEspacio> crear(@RequestBody EstadoEspacio estado) {
        return ResponseEntity.ok(service.crear(estado));
    }

    @GetMapping
    public ResponseEntity<List<EstadoEspacio>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstadoEspacio> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstadoEspacio> actualizar(@PathVariable Long id,
                                                    @RequestBody EstadoEspacio estado) {
        return ResponseEntity.ok(service.actualizar(id, estado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
