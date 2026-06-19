package cl.duoc.citt.citt_backend.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    // Configuración de Brevo API — leída desde variables de entorno
    @Value("${brevo.sender-email:citt.ts01@gmail.com}")
    private String remitente;

    @Value("${brevo.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private void enviarPorBrevo(String destinatario, String asunto, String contenido) throws Exception {
        String url = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);
        headers.set("accept", "application/json");

        Map<String, Object> body = new HashMap<>();

        Map<String, String> sender = new HashMap<>();
        sender.put("name", "Equipo CITT");
        sender.put("email", remitente);
        body.put("sender", sender);

        Map<String, String> to = new HashMap<>();
        to.put("email", destinatario);
        body.put("to", List.of(to));

        body.put("subject", asunto);
        // Brevo usa HTML, así que convertimos los saltos de línea de Java a saltos de HTML
        body.put("htmlContent", contenido.replace("\n", "<br>"));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        restTemplate.exchange(url, HttpMethod.POST, request, String.class);
    }

    // NOTIFICACIONES INFORMATIVAS: Se usa @Async
    @Async
    public void enviarCorreoAprobacion(String destinatario, Long idSolicitud, String nombreEspacio, java.util.List<String> articulos, LocalDate fecha, LocalTime horaInicio) {
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

        try {
            enviarPorBrevo(destinatario, "¡Tu Reserva #" + idSolicitud + " ha sido Aprobada! - CITT", cuerpo.toString());
            log.info("Notificación de aprobación enviada con éxito a {}", destinatario);
        } catch (Exception e) {
            log.error("Fallo al despachar correo de aprobación a {}: {}", destinatario, e.getMessage());
        }
    }

    // NOTIFICACIONES INFORMATIVAS: Se usa @Async
    @Async
    public void enviarCorreoRechazo(String destinatario, Long idSolicitud, String motivoRechazo) {
        StringBuilder cuerpo = new StringBuilder();
        cuerpo.append("Estimado/a Usuario,\n\n");
        cuerpo.append("Lamentamos informarte que tu solicitud de reserva #").append(idSolicitud).append(" ha sido RECHAZADA.\n\n");
        cuerpo.append("Motivo del rechazo:\n");
        cuerpo.append(motivoRechazo != null ? motivoRechazo : "No se especificó un motivo.").append("\n\n");
        cuerpo.append("Si tienes alguna duda, por favor contáctanos o acércate al CITT.\n\n");
        cuerpo.append("Saludos,\nEquipo CITT");

        try {
            enviarPorBrevo(destinatario, "Actualización de tu Reserva #" + idSolicitud + " - CITT", cuerpo.toString());
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
        String cuerpo = "Hola,\n\nTu cuenta ha sido creada exitosamente. Tu contraseña provisoria es: <b>" + password +
                "</b>\n\nPor favor, inicia sesión y cámbiala.\n\nCittSaludos,\nEquipo CITT";

        try {
            enviarPorBrevo(destinatario, "Tu cuenta CITT ha sido creada - Contraseña Provisoria", cuerpo);
            log.info("Correo enviado exitosamente a {}", destinatario);
        } catch (Exception e) {
            log.error("Error crítico al enviar correo a {}: {}", destinatario, e.getMessage());
            throw new cl.duoc.citt.citt_backend.exception.ReglaNegocioException(
                    "No se pudo enviar el correo con tu clave. Por favor, intenta más tarde o contacta a soporte."
            );
        }
    }

    public void enviarPasswordRecuperacion(String destinatario, String passwordTemporal) {
        String cuerpo = "Hola,\n\nHas solicitado restablecer tu contraseña.\n\nTu contraseña temporal para recuperar tu cuenta es: <b>" + passwordTemporal +
                "</b>\n\nPor favor, inicia sesión y cámbiala.\n\nCittSaludos,\nEquipo CITT";

        try {
            enviarPorBrevo(destinatario, "Recuperación de Contraseña - CITT", cuerpo);
            log.info("Correo de recuperación enviado exitosamente a {}", destinatario);
        } catch (Exception e) {
            log.error("Error al enviar recuperación a {}: {}", destinatario, e.getMessage());
            throw new cl.duoc.citt.citt_backend.exception.ReglaNegocioException(
                    "Error: No se pudo enviar el correo de recuperación."
            );
        }
    }
}
