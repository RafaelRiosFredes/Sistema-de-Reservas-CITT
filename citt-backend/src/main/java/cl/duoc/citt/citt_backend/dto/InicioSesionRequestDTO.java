package cl.duoc.citt.citt_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InicioSesionRequestDTO {

    // - validaciones-
    @NotBlank(message = "Ingresa tu correo electrónico!")
    @Email(message = "El correo electrónico es invalido! Solo correos @Duoc")
    private String email;

    @NotBlank(message = "Ingresa tu contraseña!")
    private String password;
}
