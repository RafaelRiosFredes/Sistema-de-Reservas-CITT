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
        userEmail = jwtUtilidades.extraerUsername(jwt);

        // Si hay un email y el usuario aún no ha sido autenticado
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Valida si el token no ha expirado y pertenece al usuario
            if (jwtUtilidades.esTokenValido(jwt, userDetails)) {
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
        // Continúa con el siguiente filtro
        filterChain.doFilter(request, response);
    }
}
