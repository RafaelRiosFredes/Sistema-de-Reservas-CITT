package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.*;
import cl.duoc.citt.citt_backend.services.AutenticacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AutenticacionController {

    private final AutenticacionService autenticacionService;

    // Solo los usuarios con rol COORDINADOR Y DIRECTOR pueden crear nuevos usuario
    @PostMapping("/registro")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<RegistroResponseDTO> registrar(@Valid @RequestBody RegistroRequestDTO solicitud) {
        // Ejecuta la logica de registro y devuelve estado con resultado
        return ResponseEntity.ok(autenticacionService.registrar(solicitud));
    }

    //Endpoint publico, cualquier usuario pueda crear su propia cuenta.
    //Solo necesita ingresar su correo. El rol se detecta automáticamente.
    @PostMapping("/auto-registro")
    public ResponseEntity<RegistroResponseDTO> autoRegistro(@Valid @RequestBody AutoRegistroRequestDTO solicitud) {
        return ResponseEntity.ok(autenticacionService.autoRegistrar(solicitud));
    }

    //Endpoint publico.
    // POST
    @PostMapping("/login")
    public ResponseEntity<AutenticacionResponseDTO> iniciarSesion(@Valid @RequestBody InicioSesionRequestDTO solicitud) {
        return ResponseEntity.ok(autenticacionService.iniciarSesion(solicitud));
    }

    //Lo usamos cuando el usuario entra con la clave provisoria enviada por email.
    @PutMapping("/cambiar-password")
    public ResponseEntity<String> cambiarPassword(@Valid @RequestBody CambioPasswordRequestDTO solicitud) {
        //Actualiza al booleano "debeCambiarPassword"
        autenticacionService.cambiarPassword(solicitud);
        return ResponseEntity.ok("Contraseña actualizada exitosamente");
    }

    // Genera un nuevo Access Token usando el Refresh Token
    @PostMapping("/refrescar-token")
    public ResponseEntity<AutenticacionResponseDTO> refrescarToken(@Valid @RequestBody TokenRefreshRequestDTO solicitud) {
        return ResponseEntity.ok(autenticacionService.refrescarToken(solicitud));
    }

    // Solicita el código de recuperación de contraseña
    @PostMapping("/olvido-password")
    public ResponseEntity<String> solicitarRecuperacion(@Valid @RequestBody OlvidoPasswordRequestDTO solicitud) {
        autenticacionService.solicitarRecuperacionPassword(solicitud);
        return ResponseEntity.ok("Si el correo está registrado, recibirás un código en breve.");
    }

    // Procesa el cambio de contraseña con el token
    @PostMapping("/restablecer-password")
    public ResponseEntity<String> resetearPassword(@Valid @RequestBody ResetPasswordRequestDTO solicitud) {
        autenticacionService.resetearPassword(solicitud);
        return ResponseEntity.ok("Contraseña restablecida exitosamente.");
    }

    // Cierra la sesión eliminando el Refresh Token del servidor
    @PostMapping("/logout")
    public ResponseEntity<Void> cerrarSesion(@RequestHeader(value = "Authorization", required = false) String token) {
        autenticacionService.cerrarSesion(token);
        return ResponseEntity.noContent().build();
    }
}
