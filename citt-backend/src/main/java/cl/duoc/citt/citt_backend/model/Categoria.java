package cl.duoc.citt.citt_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Getter@Setter
@NoArgsConstructor@AllArgsConstructor
@Entity
@Table(name = "categoria")
@SQLDelete(sql = "UPDATE categoria SET eliminado = true WHERE id_categoria=?")  // 1. Intercepta el comando DELETE y lo transforma en un UPDATE
@SQLRestriction("eliminado = false") // 2. Filtra automáticamente las categorias eliminadas en todos los SELECTs
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long idCategoria;

    @Column(name = "nombre_categoria", unique = true, nullable = false)
    private String nombreCategoria;

    @Column(name = "cantidad_total")
    private Integer cantidadTotal = 0;

    @Column(nullable = false)
    private boolean eliminado = false;

    @Column(name = "es_tecnologico", nullable = false)
    private boolean esTecnologico = true; // Por defecto asumimos que es prestable
}
