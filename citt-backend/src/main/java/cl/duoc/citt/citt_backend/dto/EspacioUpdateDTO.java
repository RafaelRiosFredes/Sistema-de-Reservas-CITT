package cl.duoc.citt.citt_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EspacioUpdateDTO {


    @Schema(description = "Nombre del espacio", example = "Edita el nombre del espacio")
    @Pattern(regexp = "^(?!\\d+$).+$", message = "El nombre no puede contener solo números")
    private String nombre;
    @Schema(description = "Comentarios opcionales", example = "Actualizar comentario")
    @Pattern(regexp = "^(?!\\d+$).+$", message = "El comentario no puede contener solo números")
    private String comentarios;
    @Schema(description = "Capacidad de personas", example = "Actualizar capacidad de personas")
    @Min(value = 1, message = "La capacidad debe ser de al menos 1 persona")
    @Max(value = 20, message = "La capacidad máxima permitida es de 20 personas")
    private Integer capacidad;
    @Schema(description = "Nuevo estado del espacio", example = "Actualizar estado del espacio")
    private String estado;
}
