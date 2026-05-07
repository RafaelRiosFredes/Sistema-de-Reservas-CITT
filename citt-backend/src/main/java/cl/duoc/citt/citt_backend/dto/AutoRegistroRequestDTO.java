package cl.duoc.citt.citt_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AutoRegistroRequestDTO {

    // - validaciones -
    @NotBlank(message = "Ingresa tu correo electrónico!")
    @Email(message = "El correo electrónico es invalido! Solo correos @Duoc")

    private String email; // Solo necesita el correo para auto-registrasrse
}
