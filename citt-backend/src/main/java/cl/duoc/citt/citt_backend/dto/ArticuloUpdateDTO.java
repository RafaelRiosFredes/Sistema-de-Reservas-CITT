package cl.duoc.citt.citt_backend.dto;

import lombok.*;

@Getter@Setter@ToString
@NoArgsConstructor@AllArgsConstructor
public class ArticuloUpdateDTO {
    private String nombreArticulo;
    private String comentarios;
    private String sfai;
    private String colliers;
    private String numeroSerie;
    private Double valor;
    private Integer cantidad;
    private String etiqueta;
}
