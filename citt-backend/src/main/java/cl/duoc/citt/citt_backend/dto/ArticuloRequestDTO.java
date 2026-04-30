package cl.duoc.citt.citt_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDate;

@Getter@Setter@ToString
@NoArgsConstructor@AllArgsConstructor
public class ArticuloRequestDTO {
    @NotBlank
    private String nombreArticulo;

    private String comentarios;

    private String sfai;

    private String colliers;

    private String numeroSerie;

    private Double valor;

    @NotNull
    @PositiveOrZero
    private Integer cantidad;

    private String etiqueta;

    @NotBlank
    private String tipoArticulo;

    private LocalDate fechaCompra;

    @NotBlank
    private String codigoDuoc;
}
