package cl.duoc.citt.citt_backend.dto;

import lombok.Data;

@Data
public class ArticuloDanadoDTO {
    private Long idArticulo;
    private String comentario; // Aquí el admin escribirá qué le pasó
}