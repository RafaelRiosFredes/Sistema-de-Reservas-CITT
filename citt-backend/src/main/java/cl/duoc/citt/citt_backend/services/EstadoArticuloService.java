package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.EstadoArticuloResponseDTO;

import java.util.List;

public interface EstadoArticuloService {
    List<EstadoArticuloResponseDTO> listarEstados();
}
