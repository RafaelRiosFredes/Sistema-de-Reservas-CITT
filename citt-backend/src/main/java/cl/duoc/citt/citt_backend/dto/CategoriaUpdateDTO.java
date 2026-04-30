package cl.duoc.citt.citt_backend.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaUpdateDTO {
    private String nombreCategoria;
    private Integer cantidadTotal;
}
