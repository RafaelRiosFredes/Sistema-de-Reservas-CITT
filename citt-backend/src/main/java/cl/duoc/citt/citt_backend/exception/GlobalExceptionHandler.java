package cl.duoc.citt.citt_backend.exception;

import cl.duoc.citt.citt_backend.dto.ErrorResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * El método se activa  cuando ocurre una 'ReglaNegocioException'.
     * Se usa para errores controlados (ej: El Usuario ya existe").
     */
    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ErrorResponseDTO> manejarReglaNegocioException(ReglaNegocioException ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value()) // Código 400
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura errores de formulario
     * Reúne todos los campos que fallaron (ej: email vacío) y los envía en una lista para que el usuario sepa qué corregir.
    */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> manejarValidacion(MethodArgumentNotValidException ex) {
        String mensajes = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Error de validación: " + mensajes)
                .status(HttpStatus.BAD_REQUEST.value())
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura cualquier error que no se haya previsto.
     * Guarda el error real en la consola y al usuario solo le muestra un mensaje genérico.
    **/
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> manejarExcepcionGlobal(Exception ex) {
        // El error real queda en los logs del servidor
        log.error("Error no controlado capturado: {}", ex.getMessage(), ex);

        // Al cliente solo le llega un mensaje genérico
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Ocurrió un error inesperado. Por favor, envie un correo a citt.ts01@gmail.com.")
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
