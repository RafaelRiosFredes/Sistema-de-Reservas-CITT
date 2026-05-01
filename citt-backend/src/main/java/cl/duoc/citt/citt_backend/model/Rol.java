package cl.duoc.citt.citt_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // no se premite dos roles con el mismo nombre (ej: dos "ALUMNOS")
    @Column(unique = true, nullable = false)
    private String nombre;
}
