package cl.duoc.citt.citt_backend.dto;

import lombok.Data;
import java.util.Set;

@Data
public class RegistroRequestDTO {
    private String email;
    private String password;
    private Set<String> rolesNombres; // Ahora aceptamos una lista de nombres de roles
}
