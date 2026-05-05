package cl.duoc.citt.citt_backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter@Setter@ToString
@NoArgsConstructor@AllArgsConstructor
public class ArticuloRequestDTO {
    @NotBlank(message = "El nombre del artículo no puede estar vacío")
    private String nombreArticulo;

    @NotBlank(message = "La marca es obligatoria (escriba 'Genérico' si no tiene)")
    private String marca;

    private String comentarios;
    private String sfai;
    private String colliers;
    private String numeroSerie;

    @PositiveOrZero(message = "El valor no puede ser negativo")
    private Double valor;

    private String etiqueta;

    @PastOrPresent(message = "La fecha de compra no puede ser en el futuro")
    private LocalDate fechaCompra;

    @Pattern(regexp = "^\\S+$", message = "El código no debe contener espacios")
    @Size(min = 13, max = 13, message = "El código DUOC debe tener exactamente 13 caracteres")
    private String codigoDuoc;

    @NotNull(message = "El ID de la categoría es obligatorio")
    private Long idCategoria;

    @NotNull(message = "El ID del estado del artículo es obligatorio")
    private Long idEstadoArticulo;
}
