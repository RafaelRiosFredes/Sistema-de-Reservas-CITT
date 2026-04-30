package cl.duoc.citt.citt_backend.dto;

import lombok.*;

import java.time.LocalDate;

@Getter@Setter@ToString
@NoArgsConstructor@AllArgsConstructor
@Builder
public class ArticuloResponseDTO {
    private Long idArticulo;
    private String nombreArticulo;
    private String comentarios;
    private String sfai;
    private String colliers;
    private String numeroSerie;
    private Double valor;
    private Integer cantidad;
    private String etiqueta;
    private String tipoArticulo;
    private LocalDate fechaCompra;
    private String codigoDuoc;

}
