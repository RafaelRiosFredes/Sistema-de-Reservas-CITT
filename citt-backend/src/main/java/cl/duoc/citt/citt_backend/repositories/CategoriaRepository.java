package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria,Long> {
    @Query(value = "SELECT COUNT(*) FROM categoria WHERE LOWER(nombre_categoria) = LOWER(:nombre)", nativeQuery = true)
    int contarPorNombreIgnorandoFiltros(@Param("nombre") String nombre);
}
