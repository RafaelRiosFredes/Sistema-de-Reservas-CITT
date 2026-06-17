package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.EstadoSolicitudResponseDTO;
import cl.duoc.citt.citt_backend.model.EstadoSolicitud;
import cl.duoc.citt.citt_backend.repositories.EstadoSolicitudRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EstadoSolicitudServiceImpl implements EstadoSolicitudService {

    private final EstadoSolicitudRepository estadoSolicitudRepository;

    @Override
    public List<EstadoSolicitudResponseDTO> listarEstados() {
        return estadoSolicitudRepository.findAll()
                .stream()
                .map(this::mapearADTO)
                .toList();
    }

    private EstadoSolicitudResponseDTO mapearADTO(EstadoSolicitud e) {
        return EstadoSolicitudResponseDTO.builder()
                .idEstadoSolicitud(e.getIdEstadoSolicitud())
                .nombreEstado(e.getNombre())
                .build();
    }
}