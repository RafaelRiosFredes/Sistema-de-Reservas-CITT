package cl.duoc.citt.citt_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Asegura que este filtro se ejecute exactamente una vez por cada petición HTTP.
@Component
@RequiredArgsConstructor
public class JwtFiltroAutenticacion extends OncePerRequestFilter {

    private final JwtUtilidades jwtUtilidades;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Si no hay encabezado o no empieza con "Bearer ", se ignora y se sigue con el siguiente filtro
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extrae el token (quitando la palabra "Bearer " que son 7 caracteres)
        jwt = authHeader.substring(7);

        try {
            userEmail = jwtUtilidades.extraerUsername(jwt);

            // Si hay un email y el usuario aún no ha sido autenticado
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Valida si el token no ha expirado y pertenece al usuario
                if (jwtUtilidades.esTokenValido(jwt, userDetails)) {
                    if (userDetails instanceof cl.duoc.citt.citt_backend.model.Usuario) {
                        cl.duoc.citt.citt_backend.model.Usuario usuario = (cl.duoc.citt.citt_backend.model.Usuario) userDetails;

                        if (usuario.isDebeCambiarPassword()) {
                            String rutaPeticion = request.getServletPath();

                            // Lista blanca de rutas permitidas para el usuario bloqueado
                            boolean esRutaPermitida = rutaPeticion.equals("/api/auth/cambiar-contrasena") ||
                                    rutaPeticion.equals("/api/auth/login") ||
                                    rutaPeticion.equals("/api/auth/logout") ||
                                    rutaPeticion.equals("/api/auth/cambiar-password") ||
                                    rutaPeticion.contains("/swagger-ui") ||
                                    rutaPeticion.contains("/v3/api-docs");

                            if (!esRutaPermitida) {
                                // BLOQUEO ABSOLUTO: Respondemos 403 Forbidden antes de que llegue a cualquier Controller
                                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                response.setContentType("application/json");
                                response.setCharacterEncoding("UTF-8");
                                response.getWriter().write("{\"error\": \"ACCESO_DENEGADO\", \"message\": \"Debe cambiar su contraseña predeterminada para acceder a esta función.\"}");
                                return;
                            }
                        }
                    }
                    // Crea el objeto de autenticación con los datos del usuario y sus permisos
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    // Agrega detalles adicionales de la petición
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // Guarda la autenticación
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    // DEBUG: ver qué usuario y roles se están procesando
                    System.out.println(">>> JWT Auth: " + userEmail + " | Roles: " + userDetails.getAuthorities());
                }
            }
        } catch (Exception e) {
            // Si el token es inválido o está expirado, simplemente no autenticamos
            // pero dejamos que la petición continúe (necesario para el /refresh)
            System.out.println(">>> JWT Auth Error: " + e.getMessage());
        }

        // Continúa con el siguiente filtro
        filterChain.doFilter(request, response);
    }
}
