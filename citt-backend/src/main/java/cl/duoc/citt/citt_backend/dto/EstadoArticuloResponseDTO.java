package cl.duoc.citt.citt_backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadoArticuloResponseDTO {
    private Long idEstadoArticulo;
    private String nombreEstado;
}
