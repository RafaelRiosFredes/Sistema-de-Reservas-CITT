package cl.duoc.citt.citt_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioUpdateDTO {

    // - validaciones -
    @NotBlank(message =  "Ingresa tu correo electrónico!")
    @Email(message = "El correo electrónico es invalido! Solo correos @Duoc")
    private String email;

    private Set<String> rolesNombres;
}
