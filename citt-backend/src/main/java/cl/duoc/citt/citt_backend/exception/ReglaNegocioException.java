package cl.duoc.citt.citt_backend.exception;

// Excepcion personalizada, es una excepciónque ocurre durante la ejecución del programa y no obliga a usar try-catch en todas partes.
public class ReglaNegocioException extends RuntimeException {
    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}
