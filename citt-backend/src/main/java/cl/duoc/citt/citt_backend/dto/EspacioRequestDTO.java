package cl.duoc.citt.citt_backend.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EspacioRequestDTO {

    @Schema(description = "Nombre del espacio", required = true, example = "Sala A")
    @NotBlank(message = "El nombre es obligatorio y no puede estar vacío")
    @Pattern(regexp = "^(?!\\d+$).+$", message = "El nombre no puede contener solo números")
    private String nombre;

    @Schema(description = "Comentarios opcionales", required = false, example = "Espacio con usb")
    @Pattern(regexp = "^(?!\\d+$).+$", message = "El comentario no puede contener solo números")
    private String comentarios;
}
