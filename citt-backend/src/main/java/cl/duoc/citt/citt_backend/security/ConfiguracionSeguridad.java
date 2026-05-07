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
@EnableMethodSecurity // Permite usar @PreAuthorize en los controladores
public class ConfiguracionSeguridad {

    private final JwtFiltroAutenticacion jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desactivamos CSRF ya que usamos JWT (Stateless) y no Cookies.
                .csrf(AbstractHttpConfigurer::disable)

                // reglas de autorización de las rutas
                .authorizeHttpRequests(auth -> auth
                        // --- RUTAS PÚBLICAS ---
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/auto-registro",
                                "/api/auth/refrescar-token",
                                "/api/auth/olvido-password",
                                "/api/auth/restablecer-password",
                                "/h2-console/**",     // Consola de base de datos
                                "/swagger-ui/**",     // Documentación visual API
                                "/v3/api-docs/**"     // Metadatos OpenAPI
                        ).permitAll()

                        // --- RUTAS PROTEGIDAS  ---
                        // El Logout ahora es privado para asegurar que solo un usuario real pueda cerrar sesión.
                        .requestMatchers("/api/auth/logout").authenticated()

                        // Cualquier otra petición que no esté en la lista de arriba requiere login
                        .anyRequest().authenticated()
                )


                // El servidor no guarda sesiones; cada petición debe traer su propio JWT.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                //  proveedor de autenticación personalizado
                .authenticationProvider(authenticationProvider)

                // Se agrega el FILTRO JWT.
                // Spring que ejecuta 'jwtAuthFilter' ANTES del filtro estándar de usuario/password.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // Configuración extra para la consola H2 (Permite verla en el navegador)
                .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
