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

    @NotNull(message = "Debe especificar si la categoría es de tipo tecnológico")
    private Boolean esTecnologico;
}
