package cl.duoc.citt.citt_backend.exception;

import cl.duoc.citt.citt_backend.dto.ErrorResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.access.AccessDeniedException; // <-- IMPORTANTE
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Captura errores de validación (ej: @NotBlank, @NotNull en los DTOs).
     * Reúne todos los campos que fallaron y los envía en una lista detallada.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> manejarValidacion(MethodArgumentNotValidException ex) {
        String mensajes = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Error de validación: " + mensajes)
                .status(HttpStatus.BAD_REQUEST.value())
                .fecha(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura errores de lógica de negocio personalizados controlados.
     * (ej: "El Usuario ya existe").
     */
    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ErrorResponseDTO> manejarReglaNegocioException(ReglaNegocioException ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value()) // Código 400
                .fecha(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura errores de autenticación de Spring Security (ej: claves incorrectas, usuario inexistente).
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponseDTO> manejarAutenticacion(AuthenticationException ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Credenciales inválidas. Verifica tu correo y contraseña.")
                .status(HttpStatus.UNAUTHORIZED.value()) // Código 401
                .fecha(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    /**
     * captura cuando un usuario está autenticado pero NO tiene el rol requerido (ej: Alumno entrando a zona de Director).
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> manejarAccesoDenegado(AccessDeniedException ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("No tienes los privilegios o roles necesarios para acceder a este recurso.")
                .status(HttpStatus.FORBIDDEN.value()) // Código 403 Forbidden
                .fecha(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    /**
     * Captura errores en el formato de los datos enviados en el Body.
     * (ej: enviar letras en un campo numérico del JSON).
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDTO> manejarErrorDeFormato(HttpMessageNotReadableException ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Error en el formato de los datos enviados. Verifica que los números no contengan letras o caracteres especiales.")
                .status(HttpStatus.BAD_REQUEST.value())
                .fecha(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura errores de tipo en las variables de la URL (Path variables).
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponseDTO> manejarErrorDeTipoEnURL(MethodArgumentTypeMismatchException ex) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("El valor ingresado en la URL no es válido. Se esperaba el tipo correcto y se recibió: " + ex.getValue())
                .status(HttpStatus.BAD_REQUEST.value())
                .fecha(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura cualquier otro error no previsto (Errores 500).
     * Guarda el error real en la consola y al usuario le muestra un mensaje genérico.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> manejarExcepcionGlobal(Exception ex) {
        // El error real queda en el servidor para los desarrolladores
        log.error("Error no controlado capturado: {}", ex.getMessage(), ex);

        // Al cliente solo le llega el mensaje de soporte
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .mensaje("Ocurrió un error inesperado. Por favor, envíe un correo a citt.ts01@gmail.com.")
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .fecha(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}