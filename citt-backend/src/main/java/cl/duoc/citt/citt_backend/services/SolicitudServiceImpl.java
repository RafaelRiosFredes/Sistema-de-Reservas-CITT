package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.RequerimientoDTO;
import cl.duoc.citt.citt_backend.dto.SolicitudRequestDTO;
import cl.duoc.citt.citt_backend.dto.SolicitudResponseDTO;
import cl.duoc.citt.citt_backend.dto.ActualizarEstadoSolicitudRequestDTO;
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
    private final CategoriaRepository categoriaRepository;
    private final EmailService emailService;

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
                .requerimientos(new ArrayList<>())
                .build();

        Boolean pideExclusividad = dto.getExclusividad() != null ? dto.getExclusividad() : false;

        int exclusividadesExistentes = solicitudRepository.contarExclusividadesActivas(dto.getFecha(), dto.getHoraInicio(), dto.getHoraFin());
        if (exclusividadesExistentes > 0) {
            throw new ReglaNegocioException("El CITT se encuentra reservado por completo con exclusividad institucional en el horario seleccionado.");
        }

        if (dto.getIdEspacio() != null) {
            Espacio espacio = espacioRepository.findById(dto.getIdEspacio())
                    .orElseThrow(() -> new ReglaNegocioException("El espacio solicitado no existe"));

            if (solicitud.getCantidadIntegrantes() > espacio.getCapacidad()) {
                throw new ReglaNegocioException("La cantidad de integrantes supera la capacidad del espacio.");
            }

            if (pideExclusividad) {
                int reservasActivas = solicitudRepository.contarCualquierReservaEnHorario(dto.getFecha(), dto.getHoraInicio(), dto.getHoraFin());
                if (reservasActivas > 0) {
                    throw new ReglaNegocioException("No se puede solicitar la exclusividad del CITT; existen otras reservas comunes agendadas en este bloque horario.");
                }
            } else {
                int choquesSala = solicitudRepository.contarChoquesDeHorario(espacio.getId(), dto.getFecha(), dto.getHoraInicio(), dto.getHoraFin());
                if (choquesSala > 0) {
                    throw new ReglaNegocioException("El espacio seleccionado ya tiene reservas en el horario seleccionado.");
                }
            }
            solicitud.setEspacio(espacio);

        } else if (pideExclusividad) {
            throw new ReglaNegocioException("Para solicitar la exclusividad del CITT debe seleccionar un espacio físico principal.");
        }

        if (dto.getRequerimientos() != null && !dto.getRequerimientos().isEmpty()) {
            for (RequerimientoDTO req : dto.getRequerimientos()) {

                String marcaNormalizada = req.getMarca() != null ? req.getMarca().trim().toUpperCase() : "GENERICO";

                Categoria cat = categoriaRepository.findById(req.getIdCategoria())
                        .orElseThrow(() -> new ReglaNegocioException("La categoría " + req.getIdCategoria() + " no existe."));

                int stockDisponible = articuloRepository.contarDisponiblesPorCategoriaYMarca(req.getIdCategoria(), marcaNormalizada);

                if (stockDisponible < req.getCantidad()) {
                    throw new ReglaNegocioException("No hay stock suficiente para " + cat.getNombreCategoria() + " marca " + marcaNormalizada +
                            ". Solicitados: " + req.getCantidad() + ", Disponibles: " + stockDisponible);
                }

                RequerimientoArticulo requerimiento = RequerimientoArticulo.builder()
                        .solicitud(solicitud)
                        .categoria(cat)
                        .marca(marcaNormalizada)
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

    @Override
    @Transactional
    public SolicitudResponseDTO cambiarEstado(Long idSolicitud, ActualizarEstadoSolicitudRequestDTO dto) {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new ReglaNegocioException("Solicitud no encontrada"));

        EstadoSolicitud estadoDb = estadoSolicitudRepository.findById(dto.getIdEstadoSolicitud())
                .orElseThrow(() -> new ReglaNegocioException("El estado con ID '" + dto.getIdEstadoSolicitud() + "' no existe en el sistema."));

        String nombreEstado = estadoDb.getNombre().toUpperCase();

        if (nombreEstado.equals("EN PROCESO") || nombreEstado.equals("FINALIZADA")) {
            throw new ReglaNegocioException("Para pasar a EN PROCESO o FINALIZADA, utilice las opciones de entregar o devolver equipos.");
        }

        if (nombreEstado.equals("RECHAZADA")) {
            if (dto.getMotivo() == null || dto.getMotivo().isBlank()) {
                throw new ReglaNegocioException("Para rechazar o cancelar una solicitud, debe especificar obligatoriamente un motivo explicativo.");
            }
            solicitud.setMotivoRechazo(dto.getMotivo().trim().toUpperCase());
        }

        solicitud.setEstadoSolicitud(estadoDb);
        Solicitud guardada = solicitudRepository.save(solicitud);

        // 📧 GATILLAR CORREOS AUTOMÁTICOS CONECTADOS A TU EMAILSERVICE REAL
        if (nombreEstado.equals("RECHAZADA")) {
            emailService.enviarCorreoRechazo(
                    guardada.getUsuario().getEmail(),
                    guardada.getIdSolicitud(),
                    guardada.getMotivoRechazo()
            );
        } else if (nombreEstado.equals("APROBADA")) {
            emailService.enviarCorreoAprobacion(
                    guardada.getUsuario().getEmail(),
                    guardada.getIdSolicitud(),
                    guardada.getEspacio() != null ? guardada.getEspacio().getNombre() : null,
                    guardada.getFecha(),
                    guardada.getHoraInicio()
            );
        }

        return mapToDTO(guardada);
    }

    @Override
    @Transactional
    public SolicitudResponseDTO entregarArticulos(Long idSolicitud, List<Long> idsArticulosEntregados) {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new ReglaNegocioException("Solicitud no encontrada"));

        // 1. CONTROL DE FLUJO SOBERANO: Candado de estados
        if (!solicitud.getEstadoSolicitud().getNombre().equalsIgnoreCase("APROBADA")) {
            throw new ReglaNegocioException("Operación rechazada: Solo se pueden entregar recursos para solicitudes que estén estrictamente en estado APROBADA.");
        }

        if (!solicitud.getFecha().equals(LocalDate.now())) {
            throw new ReglaNegocioException("Restricción de tiempo: Solo se pueden retirar los equipos el día agendado para la reserva: " + solicitud.getFecha());
        }

        List<Articulo> articulosFisicos = new ArrayList<>();
        if (idsArticulosEntregados != null && !idsArticulosEntregados.isEmpty()) {
            articulosFisicos = articuloRepository.findAllById(idsArticulosEntregados);

            if (articulosFisicos.size() != idsArticulosEntregados.size()) {
                throw new ReglaNegocioException("Error de consistencia: Uno o más IDs de artículos escaneados no existen en el inventario.");
            }

            // Validar disponibilidad física de cada unidad antes de ser asignada
            for (Articulo art : articulosFisicos) {
                if (!art.getEstadoArticulo().getNombreEstado().equalsIgnoreCase("DISPONIBLE")) {
                    throw new ReglaNegocioException("Conflicto de inventario: El artículo con código " + art.getCodigoDuoc() + " ya se encuentra " + art.getEstadoArticulo().getNombreEstado());
                }
            }
        }

        // 2. CORRESPONDENCIA EXACTA (La Balanza Logística de Requerimientos)
        // Agrupar cantidades solicitadas por la combinación "idCategoria_MARCA"
        java.util.Map<String, Integer> mapaRequeridos = solicitud.getRequerimientos().stream()
                .collect(Collectors.toMap(
                        r -> r.getCategoria().getIdCategoria() + "_" + r.getMarca().trim().toUpperCase(),
                        RequerimientoArticulo::getCantidad,
                        Integer::sum
                ));

        // Agrupar cantidades físicas que el ayudante intenta entregar por la misma combinación
        java.util.Map<String, Integer> mapaEntregados = new java.util.HashMap<>();
        for (Articulo art : articulosFisicos) {
            String clave = art.getCategoria().getIdCategoria() + "_" + art.getMarca().trim().toUpperCase();
            mapaEntregados.put(clave, mapaEntregados.getOrDefault(clave, 0) + 1);
        }

        // Comparar mapas de forma simétrica. Si difieren en marcas, categorías o cantidades, frena el flujo.
        if (!mapaRequeridos.equals(mapaEntregados)) {
            throw new ReglaNegocioException("Discrepancia en recursos: Los artículos físicos escaneados no coinciden en categoría, marca o cantidad exacta con lo especificado en la solicitud original.");
        }

        // 3. CAMBIO DE ESTADOS ATÓMICO
        if (!articulosFisicos.isEmpty()) {
            EstadoArticulo prestado = estadoArticuloRepository.findAll().stream()
                    .filter(e -> e.getNombreEstado().equalsIgnoreCase("PRESTADO")).findFirst().get();
            articulosFisicos.forEach(art -> art.setEstadoArticulo(prestado));
            articuloRepository.saveAll(articulosFisicos);
            solicitud.setArticulos(articulosFisicos);
        }

        if (solicitud.getEspacio() != null) {
            EstadoEspacio ocupado = estadoEspacioRepository.findAll().stream()
                    .filter(e -> e.getNombre().equalsIgnoreCase("OCUPADO")).findFirst().get();
            solicitud.getEspacio().setEstado(ocupado);
            espacioRepository.save(solicitud.getEspacio());
        }

        EstadoSolicitud enProceso = estadoSolicitudRepository.findByNombreIgnoreCase("EN PROCESO").get();
        solicitud.setEstadoSolicitud(enProceso);

        return mapToDTO(solicitudRepository.save(solicitud));
    }

    @Override
    @Transactional
    public SolicitudResponseDTO devolverArticulos(Long idSolicitud, cl.duoc.citt.citt_backend.dto.DevolucionRequestDTO dto) {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new ReglaNegocioException("Solicitud no encontrada"));

        // 1. CONTROL DE FLUJO SOBERANO: Evita re-procesar una solicitud finalizada o inactiva
        if (!solicitud.getEstadoSolicitud().getNombre().equalsIgnoreCase("EN PROCESO")) {
            throw new ReglaNegocioException("Operación rechazada: Solo se pueden devolver los recursos de una solicitud que esté actualmente EN PROCESO.");
        }

        EstadoArticulo disponibleArt = estadoArticuloRepository.findAll().stream()
                .filter(e -> e.getNombreEstado().equalsIgnoreCase("DISPONIBLE")).findFirst().get();
        EstadoArticulo danadoArt = estadoArticuloRepository.findAll().stream()
                .filter(e -> e.getNombreEstado().equalsIgnoreCase("DAÑADO")).findFirst().get();

        // 2. PROCESAMIENTO DE ARTÍCULOS
        if (solicitud.getArticulos() != null && !solicitud.getArticulos().isEmpty()) {
            for (Articulo art : solicitud.getArticulos()) {

                cl.duoc.citt.citt_backend.dto.ArticuloDanadoDTO reporteDano = dto.getArticulosDanados().stream()
                        .filter(a -> a.getIdArticulo().equals(art.getIdArticulo()))
                        .findFirst()
                        .orElse(null);

                if (reporteDano != null) {
                    if (reporteDano.getComentario() == null || reporteDano.getComentario().trim().isEmpty()) {
                        throw new ReglaNegocioException("Justificación obligatoria: Debe ingresar una explicación sobre el daño detectado en el artículo: " + art.getNombreArticulo());
                    }
                    art.setEstadoArticulo(danadoArt);
                    art.setComentarios("DAÑADO EN RESERVA #" + solicitud.getIdSolicitud() + " - MOTIVO: " + reporteDano.getComentario().trim().toUpperCase());
                } else {
                    art.setEstadoArticulo(disponibleArt);
                }
            }
            articuloRepository.saveAll(solicitud.getArticulos());
        }

        // 3. PROCESAMIENTO DEL ESPACIO FÍSICO (Comentarios exclusivos por daño en devolución)
        if (solicitud.getEspacio() != null) {
            if (Boolean.TRUE.equals(dto.getEspacioDanado())) {
                if (dto.getComentarioEspacio() == null || dto.getComentarioEspacio().trim().isEmpty()) {
                    throw new ReglaNegocioException("Justificación obligatoria: Debe ingresar una explicación detallada indicando qué daños sufrió el espacio físico.");
                }
                EstadoEspacio danadoEspacio = estadoEspacioRepository.findAll().stream()
                        .filter(e -> e.getNombre().equalsIgnoreCase("DAÑADO")).findFirst().get();

                solicitud.getEspacio().setEstado(danadoEspacio);
                // Aquí es el único punto donde se genera el comentario de daño del espacio
                solicitud.getEspacio().setComentarios("DAÑADO EN RESERVA #" + solicitud.getIdSolicitud() + " - MOTIVO: " + dto.getComentarioEspacio().trim().toUpperCase());
            } else {
                EstadoEspacio disponibleEspacio = estadoEspacioRepository.findAll().stream()
                        .filter(e -> e.getNombre().equalsIgnoreCase("DISPONIBLE")).findFirst().get();
                solicitud.getEspacio().setEstado(disponibleEspacio);
            }
            espacioRepository.save(solicitud.getEspacio());
        }

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