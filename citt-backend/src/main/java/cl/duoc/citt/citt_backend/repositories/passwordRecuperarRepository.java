package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.passwordRecuperarToken;
import cl.duoc.citt.citt_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface passwordRecuperarRepository extends JpaRepository<passwordRecuperarToken, Long> {
    Optional<passwordRecuperarToken> findByToken(String token);
    void deleteByUsuario(Usuario usuario);
}
