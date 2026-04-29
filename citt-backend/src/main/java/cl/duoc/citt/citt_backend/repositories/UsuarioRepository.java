package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
/*
        * findByEmail: Método de búsqueda personalizado.
        * Spring genera el SQL necesario para buscar un registro por la columna "email".
        * * @param email: El correo electrónico del usuario a buscar.
     * @return Optional<Usuario>: Un contenedor que puede o no tener al usuario.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}
