package cl.duoc.citt.citt_backend.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String remitente;

    private final JavaMailSender mailSender;

    // NOTIFICACIONES INFORMATIVAS: Se usa @Async
    // Si este correo falla, la reserva ya está aprobada en la base de datos.
    // No es crítico detener el sistema por esto. Queremos velocidad.
    @Async
    public void enviarCorreoAprobacion(String destinatario, Long idSolicitud, String nombreEspacio, java.util.List<String> articulos, LocalDate fecha, LocalTime horaInicio) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destinatario);
        mensaje.setSubject("¡Tu Reserva #" + idSolicitud + " ha sido Aprobada! - CITT");

        StringBuilder cuerpo = new StringBuilder();
        cuerpo.append("Estimado/a Usuario,\n\n");
        cuerpo.append("Nos alegra informarte que tu solicitud de reserva #").append(idSolicitud).append(" ha sido APROBADA.\n\n");
        cuerpo.append("Detalles de la reserva:\n");
        cuerpo.append("- Fecha: ").append(fecha).append("\n");
        cuerpo.append("- Hora de inicio: ").append(horaInicio).append("\n");
        
        if (nombreEspacio != null && !nombreEspacio.trim().isEmpty()) {
            cuerpo.append("- Espacio asignado: ").append(nombreEspacio).append("\n");
        }
        
        if (articulos != null && !articulos.isEmpty()) {
            cuerpo.append("- Artículos solicitados:\n");
            for (String art : articulos) {
                cuerpo.append("  * ").append(art).append("\n");
            }
        }
        
        cuerpo.append("\nRecuerda presentarte a la hora indicada para hacer uso de tu reserva. Si solicitaste artículos, por favor acércate a retirarlos en el mesón.\n\n");
        cuerpo.append("Saludos,\nEquipo CITT");

        mensaje.setText(cuerpo.toString());

        try {
            mailSender.send(mensaje);
            log.info("Notificación de aprobación enviada con éxito a {}", destinatario);
        } catch (Exception e) {
            log.error("Fallo al despachar correo de aprobación a {}: {}", destinatario, e.getMessage());
        }
    }

    // NOTIFICACIONES INFORMATIVAS: Se usa @Async
    @Async
    public void enviarCorreoRechazo(String destinatario, Long idSolicitud, String motivoRechazo) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Actualización de tu Reserva #" + idSolicitud + " - CITT");

        StringBuilder cuerpo = new StringBuilder();
        cuerpo.append("Estimado/a Usuario,\n\n");
        cuerpo.append("Lamentamos informarte que tu solicitud de reserva #").append(idSolicitud).append(" ha sido RECHAZADA.\n\n");
        cuerpo.append("Motivo del rechazo:\n");
        cuerpo.append(motivoRechazo != null ? motivoRechazo : "No se especificó un motivo.").append("\n\n");
        cuerpo.append("Si tienes alguna duda, por favor contáctanos o acércate al CITT.\n\n");
        cuerpo.append("Saludos,\nEquipo CITT");

        mensaje.setText(cuerpo.toString());

        try {
            mailSender.send(mensaje);
            log.info("Notificación de rechazo enviada con éxito a {}", destinatario);
        } catch (Exception e) {
            log.error("Fallo al despachar correo de rechazo a {}: {}", destinatario, e.getMessage());
        }
    }

    // ==============================================================================
    // OPERACIONES CRÍTICAS DE SEGURIDAD E IDENTIDAD: NO SE USA @Async
    // El hilo principal DEBE esperar. Si el correo no sale, la base de datos
    // debe hacer rollback. La integridad es más importante que la velocidad.
    // ==============================================================================

    public void enviarPasswordProvisoria(String destinatario, String password) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Tu cuenta CITT ha sido creada - Contraseña Provisoria");
        mensaje.setText("Hola,\n\nTu cuenta ha sido creada exitosamente. Tu contraseña provisoria es: " + password +
                "\n\nPor favor, inicia sesión y cámbiala.\n\nCittSaludos,\nEquipo CITT");

        try {
            mailSender.send(mensaje);
            log.info("Correo provisorio enviado exitosamente a {}", destinatario);
        } catch (Exception e) {
            log.error("Error crítico al enviar correo a {}: {}", destinatario, e.getMessage());
            throw new cl.duoc.citt.citt_backend.exception.ReglaNegocioException(
                    "No se pudo enviar el correo con tu clave. Por favor, intenta más tarde o contacta a soporte."
            );
        }
    }

    public void enviarPasswordRecuperacion(String destinatario, String passwordTemporal) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Recuperación de Contraseña - CITT");
        mensaje.setText("Hola,\n\nHas solicitado restablecer tu contraseña.\n\nTu contraseña temporal para recuperar tu cuenta es: " + passwordTemporal);

        try {
            mailSender.send(mensaje);
            log.info("Correo de recuperación enviado exitosamente a {}", destinatario);
        } catch (Exception e) {
            log.error("Error al enviar recuperación a {}: {}", destinatario, e.getMessage());
            throw new cl.duoc.citt.citt_backend.exception.ReglaNegocioException(
                    "Error: No se pudo enviar el correo de recuperación."
            );
        }
    }
}