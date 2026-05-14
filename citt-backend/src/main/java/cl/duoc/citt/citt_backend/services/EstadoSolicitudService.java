package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.EstadoSolicitudResponseDTO;
import java.util.List;

public interface EstadoSolicitudService {
    List<EstadoSolicitudResponseDTO> listarEstados();
}