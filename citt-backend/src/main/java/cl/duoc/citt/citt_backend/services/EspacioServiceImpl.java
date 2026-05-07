package cl.duoc.citt.citt_backend.services;


import cl.duoc.citt.citt_backend.dto.EspacioRequestDTO;
import cl.duoc.citt.citt_backend.dto.EspacioResponseDTO;
import cl.duoc.citt.citt_backend.dto.EspacioUpdateDTO;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.model.Espacio;
import cl.duoc.citt.citt_backend.model.EstadoEspacio;
import cl.duoc.citt.citt_backend.repositories.EspacioRepository;
import cl.duoc.citt.citt_backend.repositories.EstadoEspacioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class EspacioServiceImpl implements EspacioService {

    private final EspacioRepository repository;
    private final EstadoEspacioRepository estadoRepository;

    @Override
    public EspacioResponseDTO crear(EspacioRequestDTO dto){

        EstadoEspacio disponible = estadoRepository.findAll()
                .stream()
                .filter(e -> e.getNombre().equalsIgnoreCase("DISPONIBLE"))
                .findFirst()
                .orElseThrow(() -> new ReglaNegocioException("Estado DISPONIBLE no existe"));

        Espacio espacio = Espacio.builder()
                .nombre(dto.getNombre())
                .comentarios(dto.getComentarios())
                .estado(disponible)
                .build();

        return mapToDTO(repository.save(espacio));
    }


    @Override
    public List<EspacioResponseDTO>listar(){
        return repository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());


    }

   @Override
    public EspacioResponseDTO obtenerPorId(Long id){
        Espacio espacio = repository.findById(id)
                .orElseThrow(() -> new ReglaNegocioException("Espacio no encontrado"));
        return mapToDTO(espacio);
    }

    @Override
    public EspacioResponseDTO actualizar(Long id, EspacioUpdateDTO dto) {

        Espacio espacio = repository.findById(id)
                .orElseThrow(() -> new ReglaNegocioException("Espacio no encontrado"));

        espacio.setNombre(dto.getNombre());
        espacio.setComentarios(dto.getComentarios());

        if (dto.getEstado() != null) {
            EstadoEspacio estado = estadoRepository.findAll()
                    .stream()
                    // Usamos equalsIgnoreCase para ser más flexibles con mayúsculas/minúsculas
                    .filter(e -> e.getNombre().equalsIgnoreCase(dto.getEstado()))
                    .findFirst()
                    .orElseThrow(() -> new ReglaNegocioException("Estado no válido: " + dto.getEstado()));

            espacio.setEstado(estado);
        }

        return mapToDTO(repository.save(espacio));
    }

    @Override
    public void eliminar(Long id) {

        Espacio espacio = repository.findById(id)
                .orElseThrow(() -> new ReglaNegocioException("Espacio no encontrado"));

        repository.delete(espacio);
    }

    private EspacioResponseDTO mapToDTO(Espacio espacio) {
        return EspacioResponseDTO.builder()
                .id(espacio.getId())
                .nombre(espacio.getNombre())
                .comentarios(espacio.getComentarios())
                .estado(espacio.getEstado().getNombre())
                .build();
    }



}
