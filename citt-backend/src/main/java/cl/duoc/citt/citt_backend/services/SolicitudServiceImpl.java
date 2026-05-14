package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.RequerimientoDTO;
import cl.duoc.citt.citt_backend.dto.SolicitudRequestDTO;
import cl.duoc.citt.citt_backend.dto.SolicitudResponseDTO;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.model.*;
import cl.duoc.citt.citt_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
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
    private final EstadoSolicitudRepository estadoSolicitudRepository;
    private final EstadoEspacioRepository estadoEspacioRepository;
    private final EstadoArticuloRepository estadoArticuloRepository;

    // 👇 NUEVO: Inyectamos el repositorio de categorías para validar los requerimientos
    private final CategoriaRepository categoriaRepository;

    @Override
    @Transactional
    public SolicitudResponseDTO crearSolicitud(SolicitudRequestDTO dto, String emailUsuario) {

        if (dto.getHoraInicio().isAfter(dto.getHoraFin()) || dto.getHoraInicio().equals(dto.getHoraFin())) {
            throw new ReglaNegocioException("La hora de inicio debe ser anterior a la hora de fin.");
        }

        if (dto.getFecha().equals(LocalDate.now()) && dto.getHoraInicio().isBefore(LocalTime.now())) {
            throw new ReglaNegocioException("La hora de inicio de la reserva no puede estar en el pasado.");
        }

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));

        EstadoSolicitud estadoPendiente = estadoSolicitudRepository.findByNombreIgnoreCase("PENDIENTE")
                .orElseThrow(() -> new ReglaNegocioException("Estado PENDIENTE no configurado en la BD."));

        Solicitud solicitud = Solicitud.builder()
                .usuario(usuario)
                .fecha(dto.getFecha())
                .horaInicio(dto.getHoraInicio())
                .horaFin(dto.getHoraFin())
                .proposito(dto.getProposito())
                .estadoSolicitud(estadoPendiente)
                .cantidadIntegrantes(dto.getCantidadIntegrantes() != null ? dto.getCantidadIntegrantes() : 1)
                .exclusividad(dto.getExclusividad() != null ? dto.getExclusividad() : false)
                .articulos(new ArrayList<>())
                .requerimientos(new ArrayList<>()) // Inicializamos la lista de intenciones
                .build();

        // 1. VALIDACIÓN ESPACIOS
        if (dto.getIdEspacio() != null) {
            Espacio espacio = espacioRepository.findById(dto.getIdEspacio())
                    .orElseThrow(() -> new ReglaNegocioException("El espacio solicitado no existe"));

            if (solicitud.getCantidadIntegrantes() > espacio.getCapacidad()) {
                throw new ReglaNegocioException("La cantidad de integrantes supera la capacidad del espacio.");
            }

            int choques = solicitudRepository.contarChoquesDeHorario(espacio.getId(), dto.getFecha(), dto.getHoraInicio(), dto.getHoraFin());

            if (choques > 0 && solicitud.getExclusividad()) {
                throw new ReglaNegocioException("No puedes reservar este espacio con exclusividad; ya existen reservas en ese horario.");
            } else if (choques > 0) {
                throw new ReglaNegocioException("El espacio ya tiene reservas en el horario seleccionado.");
            }
            solicitud.setEspacio(espacio);
        }

        // 2. NUEVA VALIDACIÓN: REQUERIMIENTOS DE ARTÍCULOS (Lo que el alumno pide en abstracto)
        if (dto.getRequerimientos() != null && !dto.getRequerimientos().isEmpty()) {
            for (RequerimientoDTO req : dto.getRequerimientos()) {
                Categoria cat = categoriaRepository.findById(req.getIdCategoria())
                        .orElseThrow(() -> new ReglaNegocioException("La categoría " + req.getIdCategoria() + " no existe."));

                // Verificar stock real en la base de datos
                int stockDisponible = articuloRepository.contarDisponiblesPorCategoriaYMarca(req.getIdCategoria(), req.getMarca());
                if (stockDisponible < req.getCantidad()) {
                    throw new ReglaNegocioException("No hay stock suficiente para " + cat.getNombreCategoria() + " marca " + req.getMarca() +
                            ". Solicitados: " + req.getCantidad() + ", Disponibles: " + stockDisponible);
                }

                // Generar la intención
                RequerimientoArticulo requerimiento = RequerimientoArticulo.builder()
                        .solicitud(solicitud)
                        .categoria(cat)
                        .marca(req.getMarca())
                        .cantidad(req.getCantidad())
                        .build();

                solicitud.getRequerimientos().add(requerimiento);
            }
        }

        if (solicitud.getEspacio() == null && solicitud.getRequerimientos().isEmpty()) {
            throw new ReglaNegocioException("Debe solicitar al menos un espacio o un artículo.");
        }

        return mapToDTO(solicitudRepository.save(solicitud));
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


    // 👇 AHORA ESTE MÉTODO ES SOLO PARA APROBAR O RECHAZAR
    @Override
    @Transactional
    public SolicitudResponseDTO cambiarEstado(Long idSolicitud, Long idEstadoSolicitud) {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new ReglaNegocioException("Solicitud no encontrada"));

        EstadoSolicitud estadoDb = estadoSolicitudRepository.findById(idEstadoSolicitud)
                .orElseThrow(() -> new ReglaNegocioException("El estado con ID '" + idEstadoSolicitud + "' no existe en el sistema."));

        String nombreEstado = estadoDb.getNombre().toUpperCase();

        // Evitamos que el administrador se salte el flujo lógico usando el método genérico
        if (nombreEstado.equals("EN PROCESO") || nombreEstado.equals("FINALIZADA")) {
            throw new ReglaNegocioException("Para pasar a EN PROCESO o FINALIZADA, utilice las opciones de entregar o devolver equipos.");
        }

        solicitud.setEstadoSolicitud(estadoDb);
        return mapToDTO(solicitudRepository.save(solicitud));
    }


    @Override
    @Transactional
    public SolicitudResponseDTO entregarArticulos(Long idSolicitud, List<Long> idsArticulosEntregados) {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new ReglaNegocioException("Solicitud no encontrada"));

        if (!solicitud.getFecha().equals(LocalDate.now())) {
            throw new ReglaNegocioException("Solo puedes entregar equipos el día programado: " + solicitud.getFecha());
        }

        // Bloqueo Físico de Artículos
        if (idsArticulosEntregados != null && !idsArticulosEntregados.isEmpty()) {
            List<Articulo> articulosFisicos = articuloRepository.findAllById(idsArticulosEntregados);
            EstadoArticulo prestado = estadoArticuloRepository.findAll().stream()
                    .filter(e -> e.getNombreEstado().equalsIgnoreCase("PRESTADO")).findFirst().get();

            articulosFisicos.forEach(art -> art.setEstadoArticulo(prestado));
            articuloRepository.saveAll(articulosFisicos);
            solicitud.setArticulos(articulosFisicos);
        }

        // Ocupar Espacio
        if (solicitud.getEspacio() != null) {
            EstadoEspacio ocupado = estadoEspacioRepository.findAll().stream()
                    .filter(e -> e.getNombre().equalsIgnoreCase("OCUPADO")).findFirst().get();
            solicitud.getEspacio().setEstado(ocupado);
            espacioRepository.save(solicitud.getEspacio());
        }

        // Estado a EN PROCESO
        EstadoSolicitud enProceso = estadoSolicitudRepository.findByNombreIgnoreCase("EN PROCESO").get();
        solicitud.setEstadoSolicitud(enProceso);

        return mapToDTO(solicitudRepository.save(solicitud));
    }


    @Override
    @Transactional
    public SolicitudResponseDTO devolverArticulos(Long idSolicitud, List<Long> idsArticulosDanados) {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new ReglaNegocioException("Solicitud no encontrada"));

        EstadoArticulo disponible = estadoArticuloRepository.findAll().stream()
                .filter(e -> e.getNombreEstado().equalsIgnoreCase("DISPONIBLE")).findFirst().get();
        EstadoArticulo danado = estadoArticuloRepository.findAll().stream()
                .filter(e -> e.getNombreEstado().equalsIgnoreCase("DAÑADO")).findFirst().get();

        // Liberación de artículos
        if(solicitud.getArticulos() != null) {
            for (Articulo art : solicitud.getArticulos()) {
                if (idsArticulosDanados != null && idsArticulosDanados.contains(art.getIdArticulo())) {
                    art.setEstadoArticulo(danado);
                } else {
                    art.setEstadoArticulo(disponible);
                }
            }
            articuloRepository.saveAll(solicitud.getArticulos());
        }

        // Liberación de espacio
        if (solicitud.getEspacio() != null) {
            EstadoEspacio disponibleEspacio = estadoEspacioRepository.findAll().stream()
                    .filter(e -> e.getNombre().equalsIgnoreCase("DISPONIBLE")).findFirst().get();
            solicitud.getEspacio().setEstado(disponibleEspacio);
            espacioRepository.save(solicitud.getEspacio());
        }

        // Estado a FINALIZADA
        EstadoSolicitud finalizada = estadoSolicitudRepository.findByNombreIgnoreCase("FINALIZADA").get();
        solicitud.setEstadoSolicitud(finalizada);

        return mapToDTO(solicitudRepository.save(solicitud));
    }


    private SolicitudResponseDTO mapToDTO(Solicitud s) {
        return SolicitudResponseDTO.builder()
                .idSolicitud(s.getIdSolicitud())
                .fecha(s.getFecha())
                .horaInicio(s.getHoraInicio())
                .horaFin(s.getHoraFin())
                .proposito(s.getProposito())
                .estado(s.getEstadoSolicitud().getNombre())
                .cantidadIntegrantes(s.getCantidadIntegrantes())
                .exclusividad(s.getExclusividad())
                .emailUsuario(s.getUsuario().getEmail())
                .nombreEspacio(s.getEspacio() != null ? s.getEspacio().getNombre() : null)
                .nombresArticulos(s.getArticulos() != null ? s.getArticulos().stream().map(Articulo::getNombreArticulo).collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }
}