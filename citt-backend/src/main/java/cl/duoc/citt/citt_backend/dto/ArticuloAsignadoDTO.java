package cl.duoc.citt.citt_backend.dto;

import lombok.Data;

@Data
public class ArticuloAsignadoDTO {
    private Long idArticulo;
    private String nombreArticulo;
    private String codigoDuoc;
    private String marca;
}
