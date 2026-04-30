package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.Articulo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticuloRepository extends JpaRepository<Articulo,Long> {
    boolean existsByCodigoDuocIgnoreCase(String codigoDuoc);
}
