package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria,Long> {
    boolean existsByNombreCategoriaIgnoreCase(String nombreCategoria);
}
