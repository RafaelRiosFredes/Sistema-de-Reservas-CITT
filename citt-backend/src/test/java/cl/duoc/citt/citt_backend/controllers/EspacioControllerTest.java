package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.EspacioRequestDTO;
import cl.duoc.citt.citt_backend.dto.EspacioResponseDTO;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.services.EspacioService;
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
public class EspacioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EspacioService espacioService;

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
            System.out.println("│ " + nombrePrueba + ": PETICIÓN DE CREACIÓN DE ESPACIO ENVIADA");
            System.out.println("│    URL:   " + result.getRequest().getMethod() + " " + result.getRequest().getRequestURI());
            System.out.println("│");
            System.out.println("│ RESPUESTA DEL SERVIDOR/CONTROLADOR:");
            System.out.println("│    Estado HTTP: " + result.getResponse().getStatus());
            System.out.println("│    Body:  " + result.getResponse().getContentAsString(StandardCharsets.UTF_8));
            System.out.println("╰──────────────────────────────────────────────────────────╯\n");
        };
    }

    @Test
    @DisplayName("PRU-14: Intentar guardar espacio con nombre duplicado retorna 400 Bad Request")
    void crearEspacio_NombreDuplicado_Retorna400() throws Exception {
        System.out.println("\n▶ EJECUTANDO PRU-14: CREAR ESPACIO DUPLICADO (Cabina de estudio)");

        EspacioRequestDTO espacio = new EspacioRequestDTO();
        espacio.setNombre("Cabina de estudio");
        espacio.setCapacidad(20);

        Mockito.when(espacioService.crear(Mockito.any(EspacioRequestDTO.class)))
                .thenThrow(new ReglaNegocioException("Ya existe un espacio registrado con el nombre: Cabina de estudio"));

        Cookie cookieSimulada = new Cookie("token", "mocked-jwt-cookie-value");

        mockMvc.perform(post("/api/espacios")
                        .with(csrf())
                        .cookie(cookieSimulada)
                        .characterEncoding("UTF-8")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(espacio)))
                .andDo(imprimirBonito("PRU-14"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value("Ya existe un espacio registrado con el nombre: Cabina de estudio"))
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @DisplayName("PRU-15: Administrador guarda nuevo espacio con datos válidos")
    void crearEspacio_DatosValidos_Retorna200() throws Exception {
        System.out.println("\n▶ EJECUTANDO PRU-15: GUARDAR NUEVO ESPACIO (Lab 3)");

        EspacioRequestDTO espacio = new EspacioRequestDTO();
        espacio.setNombre("Lab 3");
        espacio.setCapacidad(20); // Ajustado a 20 para respetar límite del backend

        EspacioResponseDTO respuestaEsperada = EspacioResponseDTO.builder()
                .id(3L)
                .nombre("Lab 3")
                .capacidad(20)
                .estado("DISPONIBLE")
                .build();

        Mockito.when(espacioService.crear(Mockito.any(EspacioRequestDTO.class)))
                .thenReturn(respuestaEsperada);

        Cookie cookieSimulada = new Cookie("token", "mocked-jwt-cookie-value");

        mockMvc.perform(post("/api/espacios")
                        .with(csrf())
                        .cookie(cookieSimulada)
                        .characterEncoding("UTF-8")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(espacio)))
                .andDo(imprimirBonito("PRU-15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.nombre").value("Lab 3"))
                .andExpect(jsonPath("$.capacidad").value(20))
                .andExpect(jsonPath("$.estado").value("DISPONIBLE"));
    }
}
