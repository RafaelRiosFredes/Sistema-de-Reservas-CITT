package cl.duoc.citt.citt_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "estado_solicitud")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadoSolicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_solicitud")
    private Long idEstadoSolicitud;

    @Column(name = "nombre_estado", unique = true, nullable = false)
    private String nombre;
}