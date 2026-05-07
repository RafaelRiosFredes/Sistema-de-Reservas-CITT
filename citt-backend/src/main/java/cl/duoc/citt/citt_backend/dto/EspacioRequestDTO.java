package cl.duoc.citt.citt_backend.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EspacioRequestDTO {

    @Schema(description = "Nombre del espacio", required = true, example = "Sala A")
    @NotBlank(message = "El nombre es obligatorio y no puede estar vacío")
    private String nombre;

    @Schema(description = "Comentarios opcionales", required = false, example = "Espacio con usb")
    private String comentarios;
}
