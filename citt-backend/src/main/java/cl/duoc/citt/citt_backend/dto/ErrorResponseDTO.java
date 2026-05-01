package cl.duoc.citt.citt_backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorResponseDTO {
    private String mensaje;
    private int status;
}
