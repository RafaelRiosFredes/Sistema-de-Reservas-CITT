package cl.duoc.citt.citt_backend.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class DevolucionRequestDTO {
    private List<ArticuloDanadoDTO> articulosDanados = new ArrayList<>();
    private Boolean espacioDanado = false; // true si dejaron el espacio en mal estado
    private String comentarioEspacio; // Obligatorio si espacioDanado es true
}