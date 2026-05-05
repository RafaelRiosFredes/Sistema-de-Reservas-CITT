package cl.duoc.citt.citt_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;

@Getter@Setter
@NoArgsConstructor@AllArgsConstructor
@Entity
@Table(name = "articulo")
@SQLDelete(sql = "UPDATE articulo SET eliminado = true WHERE id_articulo=?") // 1. Intercepta el comando DELETE y lo transforma en un UPDATE
@SQLRestriction("eliminado = false") // 2. Filtra automáticamente los artículos eliminados en todos los SELECTs
public class Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_articulo")
    private Long idArticulo;

    @Column(name = "nombre_articulo",nullable = false)
    private String nombreArticulo;

    @Column(name = "comentarios",nullable = true)
    private String comentarios;

    @Column(name = "sfai",nullable = true)
    private String sfai;

    @Column(name = "colliers",nullable = true)
    private String colliers;

    @Column(name = "numero_serie",nullable = true)
    private String numeroSerie;

    @Column(name = "valor",nullable = true)
    private Double valor;

    @Column(name = "etiqueta",nullable = true)
    private String etiqueta;

    @Column(name = "fecha_compra",nullable = true)
    private LocalDate fechaCompra;

    @Column(name = "codigo_duoc", unique = true, nullable = false, length = 13)
    private String codigoDuoc;

    @Column(nullable = false)
    private boolean eliminado = false;

    // --- RELACIONES FÍSICAS ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estado_articulo", nullable = false)
    private EstadoArticulo estadoArticulo;
}
