package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.SolicitudRequestDTO;
import cl.duoc.citt.citt_backend.dto.SolicitudResponseDTO;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.model.Articulo;
import cl.duoc.citt.citt_backend.model.Espacio;
import cl.duoc.citt.citt_backend.model.Solicitud;
import cl.duoc.citt.citt_backend.model.Usuario;
import cl.duoc.citt.citt_backend.repositories.ArticuloRepository;
import cl.duoc.citt.citt_backend.repositories.EspacioRepository;
import cl.duoc.citt.citt_backend.repositories.SolicitudRepository;
import cl.duoc.citt.citt_backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SolicitudServiceImpl implements SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final UsuarioRepository usuarioRepository;
    private final EspacioRepository espacioRepository;
    private final ArticuloRepository articuloRepository;

    @Override
    @Transactional
    public SolicitudResponseDTO crearSolicitud(SolicitudRequestDTO dto, String emailUsuario) {

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));

        if (dto.getHoraInicio().isAfter(dto.getHoraFin()) || dto.getHoraInicio().equals(dto.getHoraFin())) {
            throw new ReglaNegocioException("La hora de inicio debe ser anterior a la hora de fin.");
        }

        Solicitud solicitud = Solicitud.builder()
                .usuario(usuario)
                .fecha(dto.getFecha())
                .horaInicio(dto.getHoraInicio())
                .horaFin(dto.getHoraFin())
                .proposito(dto.getProposito())
                .estado("PENDIENTE") // Todas nacen pendientes
                .cantidadIntegrantes(dto.getCantidadIntegrantes() != null ? dto.getCantidadIntegrantes() : 1)
                .exclusividad(dto.getExclusividad() != null ? dto.getExclusividad() : false)
                .articulos(new ArrayList<>())
                .build();

        // VALIDACIÓN: CASO 1 Y 2 (Espacios)
        if (dto.getIdEspacio() != null) {
            Espacio espacio = espacioRepository.findById(dto.getIdEspacio())
                    .orElseThrow(() -> new ReglaNegocioException("El espacio solicitado no existe"));

            // Validar capacidad
            if (solicitud.getCantidadIntegrantes() > espacio.getCapacidad()) {
                throw new ReglaNegocioException("La cantidad de integrantes supera la capacidad del espacio (" + espacio.getCapacidad() + ").");
            }

            // Validar choque de horarios para EXCLUSIVIDAD
            int choques = solicitudRepository.contarChoquesDeHorario(espacio.getId(), dto.getFecha(), dto.getHoraInicio(), dto.getHoraFin());

            // Si la nueva solicitud pide exclusividad O si ya hay reservas (lo que rompe la posibilidad de unirse si alguien más ya tiene exclusividad)
            // *Nota: Aquí puedes ajustar la lógica si permites reservas compartidas sin exclusividad.
            if (choques > 0 && solicitud.getExclusividad()) {
                throw new ReglaNegocioException("No puedes reservar este espacio con exclusividad; ya existen reservas en ese horario.");
            } else if (choques > 0) {
                // Si hay choques y NO es exclusiva, deberías sumar las capacidades actuales.
                // Por simplicidad inicial: asumimos que si choca, el espacio está ocupado.
                throw new ReglaNegocioException("El espacio ya tiene reservas en el horario seleccionado.");
            }

            solicitud.setEspacio(espacio);
        }

        // VALIDACIÓN: CASOS 1 Y 3 (Artículos)
        if (dto.getIdsArticulos() != null && !dto.getIdsArticulos().isEmpty()) {
            List<Articulo> articulosSolicitados = articuloRepository.findAllById(dto.getIdsArticulos());
            if (articulosSolicitados.size() != dto.getIdsArticulos().size()) {
                throw new ReglaNegocioException("Uno o más artículos solicitados no existen en el sistema.");
            }

            // Aquí podrías agregar validación de estado del artículo (que estén 'DISPONIBLE')
            for (Articulo art : articulosSolicitados) {
                if (!art.getEstadoArticulo().getNombreEstado().equals("DISPONIBLE")) {
                    throw new ReglaNegocioException("El artículo " + art.getNombreArticulo() + " no está disponible actualmente.");
                }
            }
            solicitud.setArticulos(articulosSolicitados);
        }

        // Validar que no envíen una solicitud vacía de ambas cosas
        if (solicitud.getEspacio() == null && solicitud.getArticulos().isEmpty()) {
            throw new ReglaNegocioException("Debe solicitar al menos un espacio o un artículo.");
        }

        Solicitud guardada = solicitudRepository.save(solicitud);
        return mapToDTO(guardada);
    }

    @Override
    public List<SolicitudResponseDTO> obtenerMisSolicitudes(String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));

        return solicitudRepository.findByUsuarioOrderByFechaDesc(usuario).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SolicitudResponseDTO> obtenerTodas() {
        return solicitudRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SolicitudResponseDTO cambiarEstado(Long idSolicitud, String nuevoEstado) {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new ReglaNegocioException("Solicitud no encontrada"));

        // Aquí puedes agregar lógica adicional. Por ejemplo, si se 'APRUEBA',
        // cambiar el estado de los artículos a 'PRESTADO'.
        solicitud.setEstado(nuevoEstado.toUpperCase());

        return mapToDTO(solicitudRepository.save(solicitud));
    }

    private SolicitudResponseDTO mapToDTO(Solicitud s) {
        return SolicitudResponseDTO.builder()
                .idSolicitud(s.getIdSolicitud())
                .fecha(s.getFecha())
                .horaInicio(s.getHoraInicio())
                .horaFin(s.getHoraFin())
                .proposito(s.getProposito())
                .estado(s.getEstado())
                .cantidadIntegrantes(s.getCantidadIntegrantes())
                .exclusividad(s.getExclusividad())
                .emailUsuario(s.getUsuario().getEmail())
                .nombreEspacio(s.getEspacio() != null ? s.getEspacio().getNombre() : null)
                .nombresArticulos(s.getArticulos().stream().map(Articulo::getNombreArticulo).collect(Collectors.toList()))
                .build();
    }
}