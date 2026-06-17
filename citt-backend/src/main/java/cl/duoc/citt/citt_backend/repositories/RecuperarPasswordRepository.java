package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.RecuperarPasswordToken;
import cl.duoc.citt.citt_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RecuperarPasswordRepository extends JpaRepository<RecuperarPasswordToken, Long> {
    Optional<RecuperarPasswordToken> findByToken(String token);

    //Se usa cada vez que un usuario pide recuperar su clave, el sistema primero borra cualquier token antiguo que el usuario tenga
    @Modifying
    void deleteByUsuario(Usuario usuario);



}

