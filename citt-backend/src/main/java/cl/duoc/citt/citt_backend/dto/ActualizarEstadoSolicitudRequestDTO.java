package cl.duoc.citt.citt_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActualizarEstadoSolicitudRequestDTO {

    @NotNull(message = "El ID del nuevo estado es obligatorio")
    private Long idEstadoSolicitud;

    private String motivo; // Justificación del rechazo (Opcional en aprobaciones, obligatorio para exclusiones)
}