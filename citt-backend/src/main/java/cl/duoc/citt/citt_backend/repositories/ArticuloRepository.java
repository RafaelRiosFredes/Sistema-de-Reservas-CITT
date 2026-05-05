package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.Articulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ArticuloRepository extends JpaRepository<Articulo,Long> {
    @Query(value = "SELECT COUNT(*) FROM articulo WHERE LOWER(codigo_duoc) = LOWER(:codigoDuoc)", nativeQuery = true)
    int contarPorCodigoDuocIgnorandoFiltros(@Param("codigoDuoc") String codigoDuoc);

    @Query(value = "SELECT COUNT(*) FROM articulo WHERE id_categoria = :idCategoria", nativeQuery = true)
    int contarPorCategoriaIdIgnorandoEliminados(@Param("idCategoria") Long idCategoria);
}
