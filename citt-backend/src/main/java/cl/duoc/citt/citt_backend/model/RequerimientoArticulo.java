package cl.duoc.citt.citt_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "requerimiento_articulo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequerimientoArticulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitud", nullable = false)
    private Solicitud solicitud;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private Integer cantidad;
}