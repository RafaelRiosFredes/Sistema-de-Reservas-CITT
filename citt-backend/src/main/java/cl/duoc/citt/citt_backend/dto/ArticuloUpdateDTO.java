package cl.duoc.citt.citt_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDate;

@Getter@Setter@ToString
@NoArgsConstructor@AllArgsConstructor
public class ArticuloUpdateDTO {
    @NotBlank(message = "El nombre del artículo no puede estar vacío")
    private String nombreArticulo;

    private String comentarios;
    private String sfai;
    private String colliers;
    private String numeroSerie;

    @PositiveOrZero(message = "El valor no puede ser negativo")
    private Double valor;

    @NotNull(message = "La cantidad no puede ser nula")
    @PositiveOrZero(message = "La cantidad debe ser 0 o un número positivo")
    private Integer cantidad;

    private String etiqueta;

    @NotBlank(message = "El tipo de articulo no puede ser nulo")
    private String tipoArticulo;

    @PastOrPresent(message = "La fecha de compra no puede ser en el futuro")
    private LocalDate fechaCompra;

    @NotNull(message = "El ID de la categoría es obligatorio")
    private Long idCategoria;

    @NotNull(message = "El ID del estado del artículo es obligatorio")
    private Long idEstadoArticulo;
}
