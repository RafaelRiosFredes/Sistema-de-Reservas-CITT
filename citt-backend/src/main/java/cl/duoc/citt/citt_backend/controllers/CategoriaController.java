package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.*;
import cl.duoc.citt.citt_backend.services.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<List<CategoriaResponseDTO>>listarCategorias(){
        return ResponseEntity.ok(categoriaService.listarCategorias());
    }

    @Operation(summary = "Listar todas (Admin)", description = "Obtiene todas las categorías incluyendo las eliminadas lógicamente.")
    @GetMapping("/todas")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<List<CategoriaResponseDTO>> listarTodasAdmin() {
        return ResponseEntity.ok(categoriaService.listarTodasAdmin());
    }

    // Cualquier usuario autenticado puede ver la información
    @Operation(summary = "Listar categorías tecnológicas", description = "Obtiene solo las categorías marcadas como tecnológicas para la vista de alumnos.")
    @GetMapping("/tecnologicas")
    public ResponseEntity<List<CategoriaResponseDTO>> listarCategoriasTecnologicas(){
        return ResponseEntity.ok(categoriaService.listarCategoriasTecnologicas());
    }

    // Cualquier usuario autenticado puede ver la información
    @Operation(summary = "Catálogo Alumnos", description = "Categorías tecnológicas agrupadas con desglose por marcas.")
    @GetMapping("/catalogo-alumnos")
    @PreAuthorize("hasAnyRole('ALUMNO', 'AYUDANTE', 'DOCENTE', 'COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<List<CategoriaAgrupadaDTO>> obtenerCatalogoAlumnos() {
        return ResponseEntity.ok(categoriaService.listarVistaAlumnos());
    }

    // Cualquier usuario autenticado puede ver la información
    @Operation(summary = "Obtener una categoria", description = "Busca una categoria específica por su ID.")
    @GetMapping("/{id:\\\\d+}")
    public ResponseEntity<CategoriaResponseDTO> obtenerCategoria(@PathVariable Long id){
        return ResponseEntity.ok(categoriaService.obtenerCategoriaPorId(id));
    }

    @Operation(summary = "Registrar una nueva categoria",description = "Crea una nueva categoria validando que su nombre no exista previamente.")
    @PostMapping
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<CategoriaResponseDTO> crearCategoria(@Valid @RequestBody CategoriaRequestDTO dto){
        return new ResponseEntity<>(categoriaService.crearCategoria(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Restaurar una categoría", description = "Revierte el borrado lógico de una categoría.")
    @PatchMapping("/{id}/restaurar")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<Map<String, String>> restaurarCategoria(@PathVariable Long id){
        categoriaService.restaurarCategoria(id);
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "La categoría con ID " + id + " fue restaurada correctamente.");
        return ResponseEntity.ok(respuesta);
    }

    @Operation(summary = "Actualizar una categoria",description = "Modifica los datos de una categoria por su ID.")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<CategoriaResponseDTO> actualizarCategoria(@PathVariable Long id, @Valid @RequestBody CategoriaUpdateDTO dto){
        return ResponseEntity.ok(categoriaService.actualizarCategoria(id,dto));
    }

    @Operation(summary = "Eliminar una categoria",description = "Elimina una categoria.")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<Map<String, String>> eliminarCategoria(@PathVariable Long id){
        categoriaService.eliminarCategoria(id);
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje","La categoria con ID " + id + " fue eliminada correctamente del sistema.");
        return ResponseEntity.ok(respuesta);
    }
}

