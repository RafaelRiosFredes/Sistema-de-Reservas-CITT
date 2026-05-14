package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.EstadoSolicitudResponseDTO;
import cl.duoc.citt.citt_backend.services.EstadoSolicitudService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/estados-solicitud")
@RequiredArgsConstructor
@Tag(name = "Estados Solicitud", description = "Operaciones para obtener los estados de las reservas")
public class EstadoSolicitudController {

    private final EstadoSolicitudService estadoSolicitudService;

    @Operation(summary = "Listar estados de solicitud", description = "Obtiene la lista de estados posibles (PENDIENTE, APROBADA, etc.) para las solicitudes.")
    @GetMapping
    public ResponseEntity<List<EstadoSolicitudResponseDTO>> listarEstados() {
        return ResponseEntity.ok(estadoSolicitudService.listarEstados());
    }
}