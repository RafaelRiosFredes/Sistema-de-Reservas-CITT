package cl.duoc.citt.citt_backend.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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


    //  Notificación de aprobación de reserva
    public void enviarCorreoAprobacion(String destinatario, Long idSolicitud, String nombreEspacio, LocalDate fecha, LocalTime horaInicio) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destinatario);
        mensaje.setSubject("¡Tu Reserva #" + idSolicitud + " ha sido Aprobada! - CITT");

        String cuerpo = "Estimado/a Usuario,\n\n" +
                "Nos alegra informarte que tu solicitud de reserva #" + idSolicitud + " ha sido APROBADA por la administración.\n\n" +
                "Detalles de la reserva:\n" +
                "- Espacio: " + (nombreEspacio != null ? nombreEspacio : "Artículos/Equipos solicitados") + "\n" +
                "- Fecha: " + fecha + "\n" +
                "- Horario: " + horaInicio + "\n\n" +
                "Recuerda asistir puntualmente. Si solicitaste equipos físicos, acércate al encargado en el horario indicado para su entrega.\n\n" +
                "Atentamente,\nEquipo de Gestión CITT";

        mensaje.setText(cuerpo);

        try {
            mailSender.send(mensaje);
            log.info("Notificación de aprobación enviada con éxito a {}", destinatario);
        } catch (Exception e) {
            log.error("Fallo al despachar correo de aprobación a {}: {}", destinatario, e.getMessage());
        }
    }

    //  Notificación de rechazo de reserva
    public void enviarCorreoRechazo(String destinatario, Long idSolicitud, String motivoRechazo) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Actualización de tu Reserva #" + idSolicitud + " - CITT");

        String cuerpo = "Estimado/a Usuario,\n\n" +
                "Te informamos que tu solicitud de reserva #" + idSolicitud + " ha sido RECHAZADA o CANCELADA por la administración.\n\n" +
                "Motivo de la resolución:\n" +
                "\"" + (motivoRechazo != null ? motivoRechazo : "No especificado por el administrador.") + "\"\n\n" +
                "Si tienes dudas o requieres reagendar, por favor acércate a la coordinación del CITT.\n\n" +
                "Atentamente,\nEquipo de Gestión CITT";

        mensaje.setText(cuerpo);

        try {
            mailSender.send(mensaje);
            log.info("Notificación de rechazo enviada con éxito a {}", destinatario);
        } catch (Exception e) {
            log.error("Fallo al despachar correo de rechazo a {}: {}", destinatario, e.getMessage());
        }
    }

    // ENVIO DE CONTRASEÑA PROVISORIA (INGRESO PRIMERA VEZ)
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

            // Lanza una excepción para que el registro se detenga si el mail falla
            throw new cl.duoc.citt.citt_backend.exception.ReglaNegocioException(
                    "No se pudo enviar el correo con tu clave. Por favor, intenta más tarde o contacta a soporte."
            );
        }
    }

    // RECUPERACION DE CONTRASEÑA (ENVIA CONTRASEÑA PROVISORA)
    public void enviarPasswordRecuperacion(String destinatario, String passwordTemporal) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Recuperación de Contraseña - CITT");
        mensaje.setText("Hola,\n\nHas solicitado restablecer tu contraseña.\n\n" +
                "Tu contraseña temporal para recuperar tu cuenta es: " + passwordTemporal + "\n\n" +
                "Ve a la opción de 'Restablecer Contraseña', ingresa esta clave temporal y elige tu nueva contraseña.\n\n" +
                "CittSaludos,\nEquipo CITT");

        try {
            mailSender.send(mensaje);
            log.info("Correo de recuperación enviado exitosamente a {}", destinatario);
        } catch (Exception e) {
            log.error("Error al enviar recuperación a {}: {}", destinatario, e.getMessage());

            // Lanza una excepción para informar del fallo técnico
            throw new cl.duoc.citt.citt_backend.exception.ReglaNegocioException(
                    "Error: No se pudo enviar el correo de recuperación."
            );
        }
    }
}
