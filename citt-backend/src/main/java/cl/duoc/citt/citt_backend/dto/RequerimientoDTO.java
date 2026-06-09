package cl.duoc.citt.citt_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RequerimientoDTO {
    @NotNull(message = "El ID de categoría es obligatorio")
    private Long idCategoria;

    private String nombreCategoria;

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;
}