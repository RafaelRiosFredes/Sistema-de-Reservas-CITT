package cl.duoc.citt.citt_backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ErrorResponseDTO {
    private String mensaje;
    private int status;
    private LocalDateTime fecha;
}
