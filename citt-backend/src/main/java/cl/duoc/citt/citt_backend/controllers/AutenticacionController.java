package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.*;
import cl.duoc.citt.citt_backend.services.AutenticacionService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AutenticacionController {

    private final AutenticacionService autenticacionService;

    @PostMapping("/registro")
    @PreAuthorize("hasAnyRole('COORDINADOR', 'DIRECTOR')")
    public ResponseEntity<RegistroResponseDTO> registrar(@Valid @RequestBody RegistroRequestDTO solicitud) {
        return ResponseEntity.ok(autenticacionService.registrar(solicitud));
    }

    @PostMapping("/auto-registro")
    public ResponseEntity<RegistroResponseDTO> autoRegistro(@Valid @RequestBody AutoRegistroRequestDTO solicitud) {
        return ResponseEntity.ok(autenticacionService.autoRegistrar(solicitud));
    }

    @PostMapping("/login")
    public ResponseEntity<String> iniciarSesion(@Valid @RequestBody InicioSesionRequestDTO solicitud, HttpServletResponse response) {
        AutenticacionResponseDTO authData = autenticacionService.iniciarSesion(solicitud);

        // Crea una cookie para el ACCESS TOKEN (1 hora)
        ResponseCookie tokenCookie = ResponseCookie.from("auth_token", authData.getToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(3600)
                .sameSite("Strict")
                .build();

        // Crea una cookie para el REFRESH TOKEN (7 días)
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", authData.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refrescar-token")
                .maxAge(604800)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", tokenCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());

        return ResponseEntity.ok("Login exitoso. Tokens configurados en cookies seguras.");
    }

    @PutMapping("/cambiar-password")
    public ResponseEntity<String> cambiarPassword(@Valid @RequestBody CambioPasswordRequestDTO solicitud) {
        autenticacionService.cambiarPassword(solicitud);
        return ResponseEntity.ok("Contraseña actualizada exitosamente");
    }

    @PostMapping("/refrescar-token")
    public ResponseEntity<AutenticacionResponseDTO> refrescarToken(
            @CookieValue(name = "refresh_token") String refreshToken, HttpServletResponse response) {

        TokenRefreshRequestDTO solicitud = new TokenRefreshRequestDTO();
        solicitud.setRefreshToken(refreshToken);

        AutenticacionResponseDTO nuevoTokens = autenticacionService.refrescarToken(solicitud);

        // Actualizar la cookie de acceso con el nuevo token
        ResponseCookie tokenCookie = ResponseCookie.from("auth_token", nuevoTokens.getToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(3600)
                .sameSite("Strict")
                .build();

        // Actualizar la cookie del Refresh Token
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", nuevoTokens.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refrescar-token")
                .maxAge(604800)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", tokenCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());

        return ResponseEntity.ok(nuevoTokens);
    }

    @PostMapping("/olvido-password")
    public ResponseEntity<String> solicitarRecuperacion(@Valid @RequestBody OlvidoPasswordRequestDTO solicitud) {
        autenticacionService.solicitarRecuperacionPassword(solicitud);
        return ResponseEntity.ok("Si el correo está registrado, recibirás un código en breve.");
    }

    @PostMapping("/restablecer-password")
    public ResponseEntity<String> resetearPassword(@Valid @RequestBody RecuperarPasswordRequestDTO solicitud) {
        autenticacionService.resetearPassword(solicitud);
        return ResponseEntity.ok("Contraseña restablecida exitosamente.");
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> cerrarSesion(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken != null) {
            try {
                autenticacionService.cerrarSesion(refreshToken);
            } catch (Exception e) {

            }
        }

        response.addHeader("Set-Cookie", "auth_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict; Secure");
        response.addHeader("Set-Cookie", "refresh_token=; Max-Age=0; Path=/api/auth/refrescar-token; HttpOnly; SameSite=Strict; Secure");

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil() {
        // Obtenemos las credenciales y roles  mapeados desde el filtro
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        java.util.List<String> roles = authentication.getAuthorities().stream()
                .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                .map(role -> role.replace("ROLE_", ""))
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(java.util.Map.of(
                "email", email,
                "roles", roles
        ));
    }
}