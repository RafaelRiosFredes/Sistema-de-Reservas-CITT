package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.*;
import cl.duoc.citt.citt_backend.services.AutenticacionService;
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
    @PostMapping("/register")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<RegistroResponseDTO> registrar(@RequestBody RegistroRequestDTO solicitud) {
        // Ejecuta la logica de registro y devuelve estado con resultado
        return ResponseEntity.ok(autenticacionService.registrar(solicitud));
    }

    //Endpoint publico, cualquier usuario pueda crear su propia cuenta.
    //Solo necesita ingresar su correo. El rol se detecta automáticamente.
    @PostMapping("/auto-registro")
    public ResponseEntity<RegistroResponseDTO> autoRegistro(@RequestBody AutoRegistroRequestDTO solicitud) {
        return ResponseEntity.ok(autenticacionService.autoRegistrar(solicitud));
    }

    //Endpoint publico.
    // POST
    @PostMapping("/login")
    public ResponseEntity<AutenticacionResponseDTO> iniciarSesion(@RequestBody InicioSesionRequestDTO solicitud) {
        return ResponseEntity.ok(autenticacionService.iniciarSesion(solicitud));
    }

    //Lo usamos cuando el usuario entra con la clave provisoria enviada por email.
    @PutMapping("/cambiar-password")
    public ResponseEntity<String> cambiarPassword(@RequestBody CambioPasswordRequestDTO solicitud) {
        //Actualiza al booleano "debeCambiarPassword"
        autenticacionService.cambiarPassword(solicitud);
        return ResponseEntity.ok("Contraseña actualizada exitosamente");
    }

    // Genera un nuevo Access Token usando el Refresh Token
    @PostMapping("/refresh")
    public ResponseEntity<AutenticacionResponseDTO> refrescarToken(@RequestBody TokenRefreshRequestDTO solicitud) {
        return ResponseEntity.ok(autenticacionService.refrescarToken(solicitud));
    }

    // Cierra la sesión eliminando el Refresh Token del servidor
    @PostMapping("/logout")
    public ResponseEntity<Void> cerrarSesion(@RequestHeader(value = "Authorization", required = false) String token) {
        autenticacionService.cerrarSesion(token);
        return ResponseEntity.noContent().build();
    }
}
