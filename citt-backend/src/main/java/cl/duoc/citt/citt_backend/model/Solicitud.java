package cl.duoc.citt.citt_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitud")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitud")
    private Long idSolicitud;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    @Column(name = "cantidad_integrantes")
    private Integer cantidadIntegrantes;

    @Column(nullable = false)
    private Boolean exclusividad;

    @Column(length = 500)
    private String proposito;

    // Estados sugeridos: PENDIENTE, APROBADA, RECHAZADA, FINALIZADA
    @Column(nullable = false)
    private String estado;

    // --- RELACIONES ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // Puede ser null si la solicitud es "Solo Artículos"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_espacio", nullable = true)
    private Espacio espacio;

    // Puede estar vacía si la solicitud es "Solo Espacio"
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "solicitud_articulo",
            joinColumns = @JoinColumn(name = "id_solicitud"),
            inverseJoinColumns = @JoinColumn(name = "id_articulo")
    )
    @Builder.Default
    private List<Articulo> articulos = new ArrayList<>();
}