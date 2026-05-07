package cl.duoc.citt.citt_backend.exception;


import cl.duoc.citt.citt_backend.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    /**
     * Captura errores de validación (como el @NotBlank en los DTOs).
     * Este se activa cuando envías campos vacíos o nulos que son obligatorios.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> manejarValidacion(MethodArgumentNotValidException ex) {
        // Extrae todos los mensajes de error definidos en el DTO y los une en un solo String
        String mensajes = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Error de validación: " + mensajes)
                .codigo(HttpStatus.BAD_REQUEST.value())
                .fecha(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura errores de lógica de negocio personalizados.
     */
    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ErrorResponseDTO> manejarReglaNegocio(ReglaNegocioException ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje(ex.getMessage())
                .codigo(HttpStatus.BAD_REQUEST.value())
                .fecha(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura cualquier otro error inesperado (Errores 500).
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> manejarGeneral(Exception ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Error interno del servidor: " + ex.getMessage())
                .codigo(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .fecha(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}