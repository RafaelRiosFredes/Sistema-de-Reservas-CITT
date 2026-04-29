package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
/**
 * findByNombre: Es un método de consulta automático.
 * Spring genera internamente la consulta SQL para buscar en la columna "nombre".
 * * Optional<Rol>: Se usa para evitar errores cuando no se encuentra el registro.
 * Si el nombre existe, devuelve el objeto; si no, devuelve un contenedor vacío.
 */
public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombre(String nombre);
}
