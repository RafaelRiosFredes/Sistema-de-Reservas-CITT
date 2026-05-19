package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.Espacio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EspacioRepository extends JpaRepository<Espacio, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
    Optional<Espacio> findByNombreIgnoreCase(String nombre);
}
