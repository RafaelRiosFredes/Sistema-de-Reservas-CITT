package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.ArticuloRequestDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloResponseDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloUpdateDTO;
import cl.duoc.citt.citt_backend.services.ArticuloService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articulos")
@RequiredArgsConstructor
@Tag(name = "Artículos",description = "Operaciones CRUD para el inventario del CITT")
public class ArticuloController {
    private final ArticuloService articuloService;

    @Operation(summary = "Listar todos los artículos",description = "Obtiene una lista de todos los artículos tecnológicos activos en el inventario.")
    @GetMapping
    public ResponseEntity<List<ArticuloResponseDTO>> listarArticulos(){
        return ResponseEntity.ok(articuloService.listarArticulos());
    }

    @Operation(summary = "Registrar un nuevo artículo",description = "Crea un artículo validando que el código Duoc no exista previamente.")
    @PostMapping
    public ResponseEntity<ArticuloResponseDTO> registrarArticulo(@Valid @RequestBody ArticuloRequestDTO dto){
        return new ResponseEntity<>(articuloService.registrarArticulo(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Actualizar un artículo",description = "Modifica los datos de un artículo existente por su ID.")
    @PutMapping("/{id}")
    public ResponseEntity<ArticuloResponseDTO> actualizarArticulo(@PathVariable Long id, @Valid @RequestBody ArticuloUpdateDTO dto){
        return ResponseEntity.ok(articuloService.actualizarArticulo(id,dto));
    }

    @Operation(summary = "Eliminar un artículo",description = "Realiza un borrado lógico (soft delete) del artículo.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminarArticulo(@PathVariable Long id){
        articuloService.eliminarArticulo(id);
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje","El artículo con ID " + id + " fue eliminado correctamente del sistema.");
        return ResponseEntity.ok(respuesta);
    }
}
