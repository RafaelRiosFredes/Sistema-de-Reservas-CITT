package cl.duoc.citt.citt_backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
public class SolicitudResponseDTO {
    private Long idSolicitud;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String proposito;
    private String estado;
    private Integer cantidadIntegrantes;
    private Boolean exclusividad;

    // Datos de relaciones (simplificados para el response)
    private String emailUsuario;
    private String nombreEspacio; // Será null si es solo artículo
    private List<String> nombresArticulos; // Nombres o Marcas de los artículos
    private List<RequerimientoDTO> requerimientos;
    private List<ArticuloAsignadoDTO> articulosAsignados;
}