package cl.duoc.citt.citt_backend.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasInventarioDTO {
    private long totalArticulosTecnologicos;
    private long totalInmobiliario;
    private long totalPrestados;
    private long totalDanados;
}