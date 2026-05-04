package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.*;
import cl.duoc.citt.citt_backend.services.CategoriaService;
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
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@Tag(name="Categorias",description =  "Operaciones CRUD para categorias del CITT")
public class CategoriaController {
    private final CategoriaService categoriaService;

    @Operation(summary = "Listar todas las categorias",description = "Obtiene una lista de todas las categorias")
    @GetMapping
    public ResponseEntity<List<CategoriaResponseDTO>>listarCategorias(){
        return ResponseEntity.ok(categoriaService.listarCategorias());
    }

    @Operation(summary = "Obtener un artículo", description = "Busca un artículo específico por su ID.")
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> obtenerCategoria(@PathVariable Long id){
        return ResponseEntity.ok(categoriaService.obtenerCategoriaPorId(id));
    }

    @Operation(summary = "Registrar una nueva categoria",description = "Crea una nueva categoria validando que su nombre no exista previamente.")
    @PostMapping
    public ResponseEntity<CategoriaResponseDTO> crearCategoria(@Valid @RequestBody CategoriaRequestDTO dto){
        return new ResponseEntity<>(categoriaService.crearCategoria(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Actualizar una categoria",description = "Modifica los datos de una categoria por su ID.")
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> actualizarCategoria(@PathVariable Long id, @Valid @RequestBody CategoriaUpdateDTO dto){
        return ResponseEntity.ok(categoriaService.actualizarCategoria(id,dto));
    }

    @Operation(summary = "Eliminar una categoria",description = "Elimina una categoria.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminarCategoria(@PathVariable Long id){
        categoriaService.eliminarCategoria(id);
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje","La categoria con ID " + id + " fue eliminada correctamente del sistema.");
        return ResponseEntity.ok(respuesta);
    }
}

