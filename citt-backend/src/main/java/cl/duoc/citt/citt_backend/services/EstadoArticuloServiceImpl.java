package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.EstadoArticuloResponseDTO;
import cl.duoc.citt.citt_backend.model.EstadoArticulo;
import cl.duoc.citt.citt_backend.repositories.EstadoArticuloRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EstadoArticuloServiceImpl implements EstadoArticuloService{
    private final EstadoArticuloRepository estadoArticuloRepository;

    private EstadoArticuloResponseDTO toDTO(EstadoArticulo e){
        return EstadoArticuloResponseDTO.builder()
                .idEstadoArticulo(e.getIdEstadoArticulo())
                .nombreEstado(e.getNombreEstado())
                .build();
    }

    @Override
    public List<EstadoArticuloResponseDTO> listarEstados() {
        return estadoArticuloRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }
}
