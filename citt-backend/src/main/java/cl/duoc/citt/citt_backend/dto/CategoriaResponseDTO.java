package cl.duoc.citt.citt_backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaResponseDTO {
    private Long idCategoria;
    private String nombreCategoria;
    private Integer cantidadTotal;
    private Boolean esTecnologico;
}
