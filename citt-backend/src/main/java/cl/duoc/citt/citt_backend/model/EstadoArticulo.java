package cl.duoc.citt.citt_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@NoArgsConstructor@AllArgsConstructor
@Entity
@Table(name = "estado_articulo")
public class EstadoArticulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_articulo")
    private Long idEstadoArticulo;

    @Column(name = "nombre_estado",unique = true, nullable = false)
    private String nombreEstado;
}
