package cl.duoc.citt.citt_backend.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EstadoEspacioResponseDTO {

    private Long id;
    private String nombre;
}

