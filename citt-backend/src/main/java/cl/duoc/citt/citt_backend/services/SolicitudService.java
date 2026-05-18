package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.SolicitudRequestDTO;
import cl.duoc.citt.citt_backend.dto.SolicitudResponseDTO;

import java.util.List;

public interface SolicitudService {
    SolicitudResponseDTO crearSolicitud(SolicitudRequestDTO dto, String emailUsuario);
    List<SolicitudResponseDTO> obtenerMisSolicitudes(String emailUsuario);
    List<SolicitudResponseDTO> obtenerTodas();
    SolicitudResponseDTO cambiarEstado(Long idSolicitud, Long idEstadoSolicitud);
    SolicitudResponseDTO entregarArticulos(Long idSolicitud, List<Long> idsArticulosEntregados);
    SolicitudResponseDTO devolverArticulos(Long idSolicitud, cl.duoc.citt.citt_backend.dto.DevolucionRequestDTO dto);
}