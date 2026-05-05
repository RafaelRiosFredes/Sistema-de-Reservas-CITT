package cl.duoc.citt.citt_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaUpdateDTO {
    @NotBlank(message = "El nombre de la categoría no puede estar vacío")
    private String nombreCategoria;

    @NotNull(message = "La cantidad total es obligatoria (ingrese 0 si no aplica)")
    @PositiveOrZero(message = "La cantidad total debe ser 0 o un número positivo")
    private Integer cantidadTotal;

    @NotNull(message = "Debe especificar si la categoría es de tipo tecnológico")
    private Boolean esTecnologico;
}
