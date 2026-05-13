package cl.duoc.citt.citt_backend.dto;

import lombok.*;

import java.time.LocalDate;

@Getter@Setter@ToString
@NoArgsConstructor@AllArgsConstructor
@Builder
public class ArticuloResponseDTO {
    private Long idArticulo;
    private String nombreArticulo;
    private String marca;
    private String comentarios;
    private String sfai;
    private String colliers;
    private String numeroSerie;
    private Double valor;
    private String etiqueta;
    private LocalDate fechaCompra;
    private String codigoDuoc;

    private Long idCategoria;
    private String nombreCategoria;

    private Long idEstadoArticulo;
    private String nombreEstado;
}
