package cl.duoc.citt.citt_backend.repositories;

import cl.duoc.citt.citt_backend.model.Solicitud;
import cl.duoc.citt.citt_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    List<Solicitud> findByUsuarioOrderByFechaDesc(Usuario usuario);

    // Consulta para verificar si un espacio ya está reservado en un horario específico
    @Query("SELECT COUNT(s) FROM Solicitud s WHERE s.espacio.id = :idEspacio " +
            "AND s.fecha = :fecha " +
            "AND s.estado IN ('PENDIENTE', 'APROBADA') " +
            "AND (s.horaInicio < :horaFin AND s.horaFin > :horaInicio)")
    int contarChoquesDeHorario(
            @Param("idEspacio") Long idEspacio,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );
}