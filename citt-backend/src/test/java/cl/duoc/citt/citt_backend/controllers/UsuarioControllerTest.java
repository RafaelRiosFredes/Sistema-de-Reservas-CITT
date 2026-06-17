package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.UsuarioUpdateDTO;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.services.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultHandler;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@SpringBootTest
@AutoConfigureMockMvc
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UsuarioService usuarioService;

    @BeforeEach
    void setUpSecurityContext() {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                "coordinador@duoc.cl",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COORDINADOR"))
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private ResultHandler imprimirBonito() {
        return result -> {
            System.out.println("\n╭──────────────────────────────────────────────────────────╮");
            System.out.println("│ PRU-05: PETICIÓN DE ACTUALIZACIÓN ENVIADA");
            System.out.println("│    URL:   " + result.getRequest().getMethod() + " " + result.getRequest().getRequestURI());
            System.out.println("│");
            System.out.println("│ RESPUESTA DEL SERVIDOR/CONTROLADOR:");
            System.out.println("│    Estado HTTP: " + result.getResponse().getStatus());
            System.out.println("│    JSON Error:  " + result.getResponse().getContentAsString(StandardCharsets.UTF_8));
            System.out.println("╰──────────────────────────────────────────────────────────╯\n");
        };
    }

    @Test
    @DisplayName("PRU-05: Intento de actualización con correo duplicado retorna 400 Bad Request y Mensaje ")
    void actualizarUsuario_CorreoExistente_Retorna400ConMensaje() throws Exception {
        System.out.println("\n▶ EJECUTANDO PRU-05: DETECTAR CORREO INSTITUCIONAL DUPLICADO EN FORMULARIO");

        String correoExistente = "alumno@duocuc.cl";

        UsuarioUpdateDTO solicitudDuplicada = new UsuarioUpdateDTO();
        solicitudDuplicada.setEmail(correoExistente);

        Long idUsuarioExistente = 1L;

        // Mockeamos la excepción usando la variable
        Mockito.when(usuarioService.actualizar(Mockito.eq(idUsuarioExistente), Mockito.any(UsuarioUpdateDTO.class)))
                .thenThrow(new ReglaNegocioException("El correo institucional '" + correoExistente + "' ya está registrado en el sistema."));

        Cookie cookieSimulada = new Cookie("token", "mocked-jwt-cookie-value");

        mockMvc.perform(put("/api/usuarios/" + idUsuarioExistente)
                        .with(csrf())
                        .cookie(cookieSimulada)
                        .characterEncoding("UTF-8")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(solicitudDuplicada)))
                .andDo(imprimirBonito())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value("El correo institucional '" + correoExistente + "' ya está registrado en el sistema."))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fecha").exists());
    }
}