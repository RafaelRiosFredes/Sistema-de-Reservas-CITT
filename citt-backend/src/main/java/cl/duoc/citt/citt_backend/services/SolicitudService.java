package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.ActualizarEstadoSolicitudRequestDTO;
import cl.duoc.citt.citt_backend.dto.SolicitudRequestDTO;
import cl.duoc.citt.citt_backend.dto.SolicitudResponseDTO;

import java.util.List;

public interface SolicitudService {
    SolicitudResponseDTO crearSolicitud(SolicitudRequestDTO dto, String emailUsuario);
    List<SolicitudResponseDTO> obtenerMisSolicitudes(String emailUsuario);
    List<SolicitudResponseDTO> obtenerTodas();
    SolicitudResponseDTO cambiarEstado(Long idSolicitud, ActualizarEstadoSolicitudRequestDTO dto);
    SolicitudResponseDTO entregarArticulos(Long idSolicitud, List<Long> idsArticulosEntregados);
    SolicitudResponseDTO devolverArticulos(Long idSolicitud, cl.duoc.citt.citt_backend.dto.DevolucionRequestDTO dto);
    List<cl.duoc.citt.citt_backend.dto.CalendarioEventoDTO> obtenerEventosCalendario(String emailUsuario);
}