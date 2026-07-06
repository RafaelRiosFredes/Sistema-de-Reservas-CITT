package cl.duoc.citt.citt_backend.services;


import cl.duoc.citt.citt_backend.dto.EspacioRequestDTO;
import cl.duoc.citt.citt_backend.dto.EspacioResponseDTO;
import cl.duoc.citt.citt_backend.dto.EspacioUpdateDTO;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.model.Espacio;
import cl.duoc.citt.citt_backend.model.EstadoEspacio;
import cl.duoc.citt.citt_backend.model.Solicitud;
import cl.duoc.citt.citt_backend.repositories.EspacioRepository;
import cl.duoc.citt.citt_backend.repositories.EstadoEspacioRepository;
import cl.duoc.citt.citt_backend.repositories.SolicitudRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class EspacioServiceImpl implements EspacioService {

    private final EspacioRepository repository;
    private final EstadoEspacioRepository estadoRepository;
    private final SolicitudRepository solicitudRepository;

    @Override
    public EspacioResponseDTO crear(EspacioRequestDTO dto){
        // REGLA DE NEGOCIO: Nombre único
        if (repository.existsByNombreIgnoreCase(dto.getNombre().trim())) {
            throw new ReglaNegocioException("Ya existe un espacio registrado con el nombre: " + dto.getNombre());
        }

        EstadoEspacio disponible = estadoRepository.findAll()
                .stream()
                .filter(e -> e.getNombre().equalsIgnoreCase("DISPONIBLE"))
                .findFirst()
                .orElseThrow(() -> new ReglaNegocioException("Estado DISPONIBLE no existe"));

        Espacio espacio = Espacio.builder()
                .nombre(dto.getNombre().trim())
                .comentarios(null) // Nace sin comentarios
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

        // REGLA DE NEGOCIO: Evitar nombres duplicados en otros IDs
        Optional<Espacio> duplicado = repository.findByNombreIgnoreCase(dto.getNombre().trim());
        if (duplicado.isPresent() && !duplicado.get().getId().equals(id)) {
            throw new ReglaNegocioException("Ya existe otro espacio ocupando el nombre: " + dto.getNombre());
        }

        if (dto.getEstado() != null) {
            EstadoEspacio estado = estadoRepository.findAll().stream()
                    .filter(e -> e.getNombre().equalsIgnoreCase(dto.getEstado()))
                    .findFirst()
                    .orElseThrow(() -> new ReglaNegocioException("Estado no válido: " + dto.getEstado()));

            espacio.setEstado(estado);

            // AUTO-LIMPIEZA: Si el coordinador repara el espacio y lo vuelve DISPONIBLE, borramos el comentario de daño.
            if (estado.getNombre().equalsIgnoreCase("DISPONIBLE")) {
                espacio.setComentarios(null);
            }
        }

        espacio.setNombre(dto.getNombre().trim());
        espacio.setCapacidad(dto.getCapacidad());

        return mapToDTO(repository.save(espacio));
    }
    @Override
    public void eliminar(Long id) {

        Espacio espacio = repository.findById(id)
                .orElseThrow(() -> new ReglaNegocioException("Espacio no encontrado"));

        repository.delete(espacio);
    }

    private EspacioResponseDTO mapToDTO(Espacio espacio) {
        LocalDate hoy = LocalDate.now();
        java.time.LocalTime ahora = java.time.LocalTime.now();
        List<Solicitud> reservasHoy = solicitudRepository.findByFecha(hoy);

        boolean enUso = false;
        for (Solicitud s : reservasHoy) {
            String estado = s.getEstadoSolicitud().getNombre().toUpperCase();
            if (estado.equals("EN PROCESO") || 
               (estado.equals("APROBADA") && !ahora.isBefore(s.getHoraInicio()) && ahora.isBefore(s.getHoraFin()))) {
                if (Boolean.TRUE.equals(s.getExclusividad()) ||
                        (s.getEspacio() != null && s.getEspacio().getId().equals(espacio.getId()))) {
                    enUso = true;
                    break;
                }
            }
        }

        return EspacioResponseDTO.builder()
                .id(espacio.getId())
                .nombre(espacio.getNombre())
                .comentarios(espacio.getComentarios())
                .capacidad(espacio.getCapacidad())
                .estado(espacio.getEstado().getNombre().toUpperCase())
                .enUsoAhora(enUso)
                .build();
    }



}
