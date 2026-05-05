package cl.duoc.citt.citt_backend.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void enviarPasswordProvisoria(String destinatario, String password) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("Tu cuenta CITT ha sido creada - Contraseña Provisoria");
        mensaje.setText("Hola,\n\nTu cuenta ha sido creada exitosamente. Tu contraseña provisoria es: " + password +
                "\n\nPor favor, inicia sesión y cámbiala.\n\nSaludos,\nEquipo CITT");

        try {
            mailSender.send(mensaje);
            log.info("Correo provisorio enviado exitosamente a {}", destinatario);
        } catch (Exception e) {
            log.error("Error al enviar correo a {}: {}", destinatario, e.getMessage());
        }
    }

    public void enviarPasswordRecuperacion(String destinatario, String passwordTemporal) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("Recuperación de Contraseña - CITT");
        mensaje.setText("Hola,\n\nHas solicitado restablecer tu contraseña.\n\n" +
                "Tu contraseña temporal para recuperar tu cuenta es: " + passwordTemporal + "\n\n" +
                "Ve a la opción de 'Restablecer Contraseña', ingresa esta clave temporal y elige tu nueva contraseña segura.\n\n" +
                "Saludos,\nEquipo CITT");

        try {
            mailSender.send(mensaje);
            log.info("Correo de recuperación enviado exitosamente a {}", destinatario);
        } catch (Exception e) {
            log.error("Error al enviar correo de recuperación a {}: {}", destinatario, e.getMessage());
        }
    }
}
