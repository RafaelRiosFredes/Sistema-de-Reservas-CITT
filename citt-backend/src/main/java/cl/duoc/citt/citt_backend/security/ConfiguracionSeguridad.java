package cl.duoc.citt.citt_backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class ConfiguracionSeguridad {

    private final JwtFiltroAutenticacion jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    // se decide qué peticiones pasan y cuáles se bloquean.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desactiva CSRF (Cross-Site Request Forgery) porque usamos tokens JWT, no cookies
                .csrf(AbstractHttpConfigurer::disable)
                // Configuración de permisos de rutas
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas
                        .requestMatchers("/api/auth/login", "/api/auth/auto-registro", "/api/auth/refrescar-token", "/api/auth/olvido-password", "/api/auth/restablecer-password", "/api/auth/logout", "/h2-console/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // Cualquier otra ruta requiere que el usuario esté autenticado
                        .anyRequest().authenticated()
                )
                // No se guardan sesiones en el servidor
                // Cada petición debe traer su propio token JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                // Añade el filtro JWT antes del filtro de usuario/contraseña estándar
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                // Desactiva la protección de frames para poder ver la consola H2 en el navegador
                .headers(headers -> headers.frameOptions(frame -> frame.disable())); // Para H2 Console

        return http.build();
    }
}
