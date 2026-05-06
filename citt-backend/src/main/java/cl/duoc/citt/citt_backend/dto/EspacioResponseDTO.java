package cl.duoc.citt.citt_backend.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EspacioResponseDTO {

    private Long id;
    private String nombre;
    private String comentarios;
    private String estado;
}
