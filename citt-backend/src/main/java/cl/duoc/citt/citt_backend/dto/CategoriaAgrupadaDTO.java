package cl.duoc.citt.citt_backend.dto;

import lombok.*;
import java.util.List;

@Getter@Setter@NoArgsConstructor@AllArgsConstructor
public class CategoriaAgrupadaDTO {
    private Long idCategoria;
    private String nombreCategoria;
    private Integer totalCategoria;
    private List<MarcaDesgloseDTO> desgloseMarcas;
}
