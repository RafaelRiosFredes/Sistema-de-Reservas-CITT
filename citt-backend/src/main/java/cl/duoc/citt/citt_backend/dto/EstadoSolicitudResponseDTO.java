package cl.duoc.citt.citt_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadoSolicitudResponseDTO {
    private Long idEstadoSolicitud;
    private String nombreEstado;
}