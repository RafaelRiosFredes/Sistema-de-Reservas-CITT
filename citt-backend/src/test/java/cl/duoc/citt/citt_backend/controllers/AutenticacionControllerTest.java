package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.InicioSesionRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultHandler;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AutenticacionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Impresor bonnito
    private ResultHandler imprimirBonito() {
        return result -> {
            System.out.println("\n╭──────────────────────────────────────────────────────────╮");
            System.out.println("│ PETICIÓN ENVIADA:");
            System.out.println("│       URL:   " + result.getRequest().getMethod() + " " + result.getRequest().getRequestURI());
            System.out.println("│       Datos: " + result.getRequest().getContentAsString());
            System.out.println("│");
            System.out.println("│ RESPUESTA DEL SERVIDOR:");
            System.out.println("│       Estado HTTP: " + result.getResponse().getStatus());
            System.out.println("│       Mensaje:     " + result.getResponse().getContentAsString());
            System.out.println("╰──────────────────────────────────────────────────────────╯\n");
        };
    }

    @Test
    @DisplayName("PRU-02: Login exitoso retorna 200 ")
    void loginExitoso_RetornaOk() throws Exception {
        System.out.println("\n▶ EJECUTANDO PRU-02: LOGIN CON CLAVE CORRECTA");

        InicioSesionRequestDTO loginRequest = new InicioSesionRequestDTO();
        loginRequest.setEmail("admin@duoc.cl");
        loginRequest.setPassword("admin123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(imprimirBonito()) //  impresor
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("PRU-02: Login con contraseña incorrecta retorna Error de Cliente ")
    void loginConContrasenaIncorrecta_RetornaError() throws Exception {
        System.out.println("\n▶ EJECUTANDO PRU-02: LOGIN CON CLAVE INCORRECTA");

        InicioSesionRequestDTO loginRequest = new InicioSesionRequestDTO();
        loginRequest.setEmail("admin@duoc.cl");
        loginRequest.setPassword("ClaveErronea");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(imprimirBonito()) //  impresor
                .andExpect(status().is4xxClientError());
    }
}