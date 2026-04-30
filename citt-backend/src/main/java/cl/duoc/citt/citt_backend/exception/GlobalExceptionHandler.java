package cl.duoc.citt.citt_backend.exception;

import cl.duoc.citt.citt_backend.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ErrorResponseDTO> manejarReglaNegocioException(ReglaNegocioException ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value()) // Código 400
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     *  "Plan B". Captura cualquier otra excepción que no sea de negocio
     * (ej: errores de base de datos, fallos de conexión, NullPointer, etc.).
     */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> manejarExcepcionGlobal(Exception ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Ha ocurrido un error inesperado en el servidor.")
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .build();
        // Se retorna el error con estado 500
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
