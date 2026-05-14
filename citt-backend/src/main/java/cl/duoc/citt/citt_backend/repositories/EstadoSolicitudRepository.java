package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.EstadoSolicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoSolicitudRepository extends JpaRepository<EstadoSolicitud, Long> {
    Optional<EstadoSolicitud> findByNombreIgnoreCase(String nombre);
}