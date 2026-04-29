package cl.duoc.citt.citt_backend.security;

import cl.duoc.citt.citt_backend.repositories.UsuarioRepository;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AplicacionConfig {

    private final UsuarioRepository usuarioRepository;

    /**
     * Configura Swagger (OpenAPI) para documentar la API.
     * Incluye el soporte para enviar el Token JWT (Bearer Auth) desde la interfaz de pruebas.
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CITT API")
                        .version("v1")
                        .description("Documentación de la API del Proyecto CITT con soporte JWT"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .name("bearerAuth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }

    //  Define cómo Spring Security debe buscar al usuario
    //  al intentar autenticarlo.Usa el repositorio para buscar por email; si no existe, lanza un error de seguridad.
    @Bean
    public UserDetailsService userDetailsService() {
        return email -> usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado en la base de datos"));
    }

   // valida las credenciales.
   // Conecta el servicio de búsqueda de usuarios con el sistema de encriptación de claves.
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider proveedorAuth = new DaoAuthenticationProvider();
        proveedorAuth.setUserDetailsService(userDetailsService());
        proveedorAuth.setPasswordEncoder(passwordEncoder());
        return proveedorAuth;
    }


     // Se gestiona el proceso de login en la app.

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuracion) throws Exception {
        return configuracion.getAuthenticationManager();
    }

    //Define el algoritmo para encriptar claves.
    //BCrypt es el estándar actual y aplica un hash seguro a las contraseñas.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
