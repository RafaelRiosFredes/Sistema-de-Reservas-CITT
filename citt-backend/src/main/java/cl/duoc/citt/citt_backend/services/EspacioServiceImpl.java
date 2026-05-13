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
                .capacidad(dto.getCapacidad())
                .estado(disponible)
                .build();

        return mapToDTO(repository.save(espacio));
    }


    @Override
    public List<EspacioResponseDTO> listar(String estadoNombre) {
        List<Espacio> lista;

        // Si el frontend envía un estado (ej: ?estado=DAÑADO), filtramos en la lista
        if (estadoNombre != null && !estadoNombre.isEmpty()) {
            lista = repository.findAll().stream()
                    .filter(e -> e.getEstado().getNombre().equalsIgnoreCase(estadoNombre))
                    .collect(Collectors.toList());
        } else {
            // Si no envía nada, listamos todo como antes
            lista = repository.findAll();
        }

        return lista.stream().map(this::mapToDTO).collect(Collectors.toList());
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

        // --- NUEVA REGLA DE NEGOCIO PARA COMENTARIOS ---
        if (dto.getEstado() != null) {
            String nuevoEstado = dto.getEstado().toUpperCase();

            // Lista de estados que requieren explicación obligatoria
            List<String> estadosCriticos = List.of("DAÑADO", "MANTENCION");

            if (estadosCriticos.contains(nuevoEstado)) {
                if (dto.getComentarios() == null || dto.getComentarios().trim().isEmpty()) {
                    throw new ReglaNegocioException("Para el estado " + nuevoEstado +
                            ", debe ingresar obligatoriamente un comentario explicando la razón.");
                }
            }

            // Buscar y asignar el nuevo estado
            EstadoEspacio estado = estadoRepository.findAll().stream()
                    .filter(e -> e.getNombre().equalsIgnoreCase(dto.getEstado()))
                    .findFirst()
                    .orElseThrow(() -> new ReglaNegocioException("Estado no válido: " + dto.getEstado()));

            espacio.setEstado(estado);
        }

        espacio.setNombre(dto.getNombre());
        espacio.setCapacidad(dto.getCapacidad());
        espacio.setComentarios(dto.getComentarios());

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
                .capacidad(espacio.getCapacidad())
                // Forzar mayúsculas ayuda a evitar errores en el === del frontend
                .estado(espacio.getEstado().getNombre().toUpperCase())
                .build();
    }



}
