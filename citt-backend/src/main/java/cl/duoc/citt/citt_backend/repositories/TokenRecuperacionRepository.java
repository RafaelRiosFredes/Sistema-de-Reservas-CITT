package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.TokenRecuperacion;
import cl.duoc.citt.citt_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRecuperacionRepository extends JpaRepository<TokenRecuperacion, Long> {
    Optional<TokenRecuperacion> findByToken(String token);
    void deleteByUsuario(Usuario usuario);
}
