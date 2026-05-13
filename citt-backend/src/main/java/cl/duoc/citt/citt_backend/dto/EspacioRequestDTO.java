package cl.duoc.citt.citt_backend.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EspacioRequestDTO {

    @Schema(description = "Nombre del espacio", required = true, example = "Sala A")
    @NotBlank(message = "El nombre es obligatorio y no puede estar vacío")
    @Pattern(regexp = "^(?!\\d+$).+$", message = "El nombre no puede contener solo números")
    private String nombre;

    @Schema(description = "Capacidad de personas", required = true, example = "20")
    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad debe ser de al menos 1 persona")
    @Max(value = 20, message = "La capacidad máxima permitida es de 20 personas")
    private Integer capacidad;

    @Schema(description = "Comentarios opcionales", required = false, example = "Proposito de la actividad")
    @Pattern(regexp = "^(?!\\d+$).+$", message = "El comentario no puede contener solo números")
    private String comentarios;
}
