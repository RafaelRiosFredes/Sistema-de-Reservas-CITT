package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.ArticuloRequestDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloResponseDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloUpdateDTO;
import cl.duoc.citt.citt_backend.dto.EstadisticasInventarioDTO;
import cl.duoc.citt.citt_backend.services.ArticuloService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articulos")
@RequiredArgsConstructor
@Tag(name = "Artículos",description = "Operaciones CRUD para el inventario del CITT")
public class ArticuloController {
    private final ArticuloService articuloService;

    @Operation(summary = "Listar artículos (Admin)", description = "Lista paginada y filtrable por categoría, nombre y estado lógico.")
    @GetMapping
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<Page<ArticuloResponseDTO>> listarArticulos(
            @RequestParam(required = false) Long idCategoria,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false, defaultValue = "false") boolean mostrarEliminados,
            Pageable pageable) {
        return ResponseEntity.ok(articuloService.listarArticulosAdmin(idCategoria, nombre, mostrarEliminados, pageable));
    }

    @Operation(summary = "Listar tecnológicos por estado (Admin)", description = "Obtiene una lista paginada de artículos tecnológicos filtrados por su estado (DISPONIBLE, PRESTADO, DAÑADO, MANTENCION).")
    @GetMapping("/tecnologicos/estado/{estado}")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<Page<ArticuloResponseDTO>> listarTecnologicosPorEstado(
            @PathVariable String estado,
            Pageable pageable) {
        return ResponseEntity.ok(articuloService.listarTecnologicosPorEstado(estado, pageable));

    }

    // Cualquier usuario autenticado puede ver la información
    @Operation(summary = "Obtener un artículo", description = "Busca un artículo específico por su ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ArticuloResponseDTO> obtenerArticulo(@PathVariable Long id){
        return ResponseEntity.ok(articuloService.obtenerArticuloPorId(id));
    }

    @Operation(summary = "Registrar un nuevo artículo",description = "Crea un artículo validando que el código Duoc no exista previamente.")
    @PostMapping
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<ArticuloResponseDTO> registrarArticulo(@Valid @RequestBody ArticuloRequestDTO dto){
        return new ResponseEntity<>(articuloService.registrarArticulo(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Actualizar un artículo",description = "Modifica los datos de un artículo existente por su ID.")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<ArticuloResponseDTO> actualizarArticulo(@PathVariable Long id, @Valid @RequestBody ArticuloUpdateDTO dto){
        return ResponseEntity.ok(articuloService.actualizarArticulo(id,dto));
    }

    @Operation(summary = "Eliminar un artículo",description = "Realiza un borrado lógico (soft delete) del artículo.")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<Map<String, String>> eliminarArticulo(@PathVariable Long id){
        articuloService.eliminarArticulo(id);
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje","El artículo con ID " + id + " fue eliminado correctamente del sistema.");
        return ResponseEntity.ok(respuesta);
    }

    @Operation(summary = "Eliminar Definitivamente (Admin)", description = "Borrado físico. Fallará si el artículo tiene historial.")
    @DeleteMapping("/{id}/definitivo")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<Void> eliminarFisicamente(@PathVariable Long id) {
        articuloService.eliminarFisicamente(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Obtener estadísticas del inventario", description = "Devuelve los conteos globales para las tarjetas del dashboard de administración.")
    @GetMapping("/estadisticas")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<EstadisticasInventarioDTO> obtenerEstadisticas() {
        return ResponseEntity.ok(articuloService.obtenerEstadisticasDashboard());
    }

    @Operation(summary = "Restaurar un artículo", description = "Revierte el borrado lógico de un artículo.")
    @PatchMapping("/{id}/restaurar")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<Map<String, String>> restaurarArticulo(@PathVariable Long id){
        articuloService.restaurarArticulo(id);
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Artículo ID " + id + " restaurado correctamente.");
        return ResponseEntity.ok(respuesta);
    }
}
