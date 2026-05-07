package cl.duoc.citt.citt_backend.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "espacios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Espacio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String comentarios;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estado_id")
    private  EstadoEspacio estado;

}
