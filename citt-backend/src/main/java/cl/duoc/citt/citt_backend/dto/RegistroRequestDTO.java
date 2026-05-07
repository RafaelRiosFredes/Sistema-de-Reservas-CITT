package cl.duoc.citt.citt_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.Set;

@Data
public class RegistroRequestDTO {

    // - validaciones -
    @NotBlank(message = "Ingresa tu correo electrónico! ")
    @Email(message = "El correo electrónico es invalido! Solo correos @Duoc")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria!")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$",
            message = "La contraseña debe contener al menos una mayúscula, una minúscula y un número ")
    private String password;

    private Set<String> rolesNombres; // lista de nombres de roles
}
