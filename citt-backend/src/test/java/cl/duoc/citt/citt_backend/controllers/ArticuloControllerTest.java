package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.ArticuloRequestDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloResponseDTO;
import cl.duoc.citt.citt_backend.services.ArticuloService;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@SpringBootTest
@AutoConfigureMockMvc
public class ArticuloControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ArticuloService articuloService;

    @BeforeEach
    void setUpSecurityContext() {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                "coordinador@duoc.cl",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COORDINADOR"))
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private ResultHandler imprimirBonito(String nombrePrueba) {
        return result -> {
            System.out.println("\n╭──────────────────────────────────────────────────────────╮");
            System.out.println("│ " + nombrePrueba + ": PETICIÓN DE CREACIÓN ENVIADA");
            System.out.println("│    URL:   " + result.getRequest().getMethod() + " " + result.getRequest().getRequestURI());
            System.out.println("│");
            System.out.println("│ RESPUESTA DEL SERVIDOR/CONTROLADOR:");
            System.out.println("│    Estado HTTP: " + result.getResponse().getStatus());
            System.out.println("│    Body:  " + result.getResponse().getContentAsString(StandardCharsets.UTF_8));
            System.out.println("╰──────────────────────────────────────────────────────────╯\n");
        };
    }

    @Test
    @DisplayName("PRU-12: Administrador guarda nuevo artículo con datos válidos")
    void guardarArticulo_DatosValidos_Retorna201() throws Exception {
        System.out.println("\n▶ EJECUTANDO PRU-12: GUARDAR NUEVO ARTÍCULO (NOTEBOOK)");

        ArticuloRequestDTO articulo = new ArticuloRequestDTO();
        articulo.setNombreArticulo("Notebook");
        articulo.setIdCategoria(2L);
        articulo.setIdEstadoArticulo(1L);

        ArticuloResponseDTO respuestaEsperada = ArticuloResponseDTO.builder()
                .idArticulo(10L)
                .nombreArticulo("Notebook")
                .nombreCategoria("COMPUTADORES")
                .nombreEstado("DISPONIBLE")
                .build();

        Mockito.when(articuloService.registrarArticulo(Mockito.any(ArticuloRequestDTO.class)))
                .thenReturn(respuestaEsperada);

        Cookie cookieSimulada = new Cookie("token", "mocked-jwt-cookie-value");

        mockMvc.perform(post("/api/articulos")
                        .with(csrf())
                        .cookie(cookieSimulada)
                        .characterEncoding("UTF-8")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(articulo)))
                .andDo(imprimirBonito("PRU-12"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idArticulo").value(10))
                .andExpect(jsonPath("$.nombreArticulo").value("Notebook"))
                .andExpect(jsonPath("$.nombreCategoria").value("COMPUTADORES"))
                .andExpect(jsonPath("$.nombreEstado").value("DISPONIBLE"));
    }
}
