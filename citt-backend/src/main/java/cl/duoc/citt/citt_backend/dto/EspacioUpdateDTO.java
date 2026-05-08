package cl.duoc.citt.citt_backend.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EspacioUpdateDTO {


    @Pattern(regexp = "^(?!\\d+$).+$", message = "El nombre no puede contener solo números")
    private String nombre;
    @Pattern(regexp = "^(?!\\d+$).+$", message = "El comentario no puede contener solo números")
    private String comentarios;
    private String estado;
}
