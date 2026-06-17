package cl.duoc.citt.citt_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarioEventoDTO {
    private Long idSolicitud;
    private String title;
    private LocalDate date;
    private LocalTime start;
    private LocalTime end;
    private String nombreEspacio;
    private Boolean esExclusivo;
    
    // Campos exclusivos para admin
    private String solicitanteEmail;
    private String estadoActual;
}
