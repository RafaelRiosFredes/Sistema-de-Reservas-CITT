package cl.duoc.citt.citt_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AutenticacionResponseDTO {
    private String token;
    private String refreshToken;
    private String email;
    private Set<String> roles;
    private boolean debeCambiarPassword;
}
