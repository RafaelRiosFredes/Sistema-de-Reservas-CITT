package cl.duoc.citt.citt_backend.exception;

import cl.duoc.citt.citt_backend.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.stream.Collectors;

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
        ex.printStackTrace();

        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Ha ocurrido un error inesperado en el servidor.")
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .build();
        // Se retorna el error con estado 500
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> manejarValidaciones(MethodArgumentNotValidException ex) {
        // Extrae todos los mensajes de error de los campos que fallaron y los une en un texto
        String mensajesDeError = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Error de validación: " + mensajesDeError)
                .status(HttpStatus.BAD_REQUEST.value())
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDTO> manejarErrorDeFormato(HttpMessageNotReadableException ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Error en el formato de los datos enviados. Verifica que los números no contengan letras o caracteres especiales.")
                .status(HttpStatus.BAD_REQUEST.value())
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponseDTO> manejarErrorDeTipoEnURL(MethodArgumentTypeMismatchException ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("El valor ingresado en la URL no es válido. Se esperaba un número y se recibió: " + ex.getValue())
                .status(HttpStatus.BAD_REQUEST.value())
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
