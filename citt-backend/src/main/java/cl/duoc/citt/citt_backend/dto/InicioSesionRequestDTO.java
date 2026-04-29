package cl.duoc.citt.citt_backend.dto;

import lombok.Data;

@Data
public class InicioSesionRequestDTO {
    private String email;
    private String password;
}
