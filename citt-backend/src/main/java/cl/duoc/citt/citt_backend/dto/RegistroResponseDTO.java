package cl.duoc.citt.citt_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegistroResponseDTO {
    private String mensaje;
    private String email;
    private Set<String> roles; // Ahora devolvemos una lista de roles
}