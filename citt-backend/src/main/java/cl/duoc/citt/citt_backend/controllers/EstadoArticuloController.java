package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.EstadoArticuloResponseDTO;
import cl.duoc.citt.citt_backend.services.EstadoArticuloService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/estados")
@RequiredArgsConstructor
@Tag(name = "Estados",description = "Lista de los estados posibles para los articulos")
public class EstadoArticuloController {
    private final EstadoArticuloService estadoArticuloService;

    @Operation(summary = "Listar todos los estados de articulo", description = "Obtiene una lista de todos los estados que puede tener un articulo")
    @GetMapping
    public ResponseEntity<List<EstadoArticuloResponseDTO>> listarEstados(){
        return ResponseEntity.ok(estadoArticuloService.listarEstados());
    }
}
