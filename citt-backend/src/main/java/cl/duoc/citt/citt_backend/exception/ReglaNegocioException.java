package cl.duoc.citt.citt_backend.exception;

import org.springframework.http.HttpStatus;

public class ReglaNegocioException extends RuntimeException {
    
    private final HttpStatus status;

    public ReglaNegocioException(String mensaje) {
        super(mensaje);
        this.status = HttpStatus.BAD_REQUEST; // Por defecto 400
    }

    public ReglaNegocioException(String mensaje, HttpStatus status) {
        super(mensaje);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
