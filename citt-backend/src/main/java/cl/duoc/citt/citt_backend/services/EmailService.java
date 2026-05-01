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

    // Interfaz de Spring para enviar correos usando el protocolo SMTP.
    private final JavaMailSender mailSender;


    /**
     * Construye y envía un correo con la contraseña temporal generada.
     * @param destinatario El email del usuario registrado.
     * @param password La clave temporal creada por AutenticacionService.
     */
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
}
