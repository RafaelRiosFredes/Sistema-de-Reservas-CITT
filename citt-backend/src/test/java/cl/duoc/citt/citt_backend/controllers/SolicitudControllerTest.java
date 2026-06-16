package cl.duoc.citt.citt_backend.controllers;

import cl.duoc.citt.citt_backend.dto.SolicitudRequestDTO;
import cl.duoc.citt.citt_backend.dto.SolicitudResponseDTO;
import cl.duoc.citt.citt_backend.dto.RequerimientoDTO;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import org.springframework.http.HttpStatus;
import cl.duoc.citt.citt_backend.services.SolicitudService;
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
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@SpringBootTest
@AutoConfigureMockMvc
public class SolicitudControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SolicitudService solicitudService;

    @BeforeEach
    void setUpSecurityContext() {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                "alumno@duocuc.cl",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ALUMNO"))
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private ResultHandler imprimirBonito(String nombrePrueba) {
        return result -> {
            System.out.println("\n╭──────────────────────────────────────────────────────────╮");
            System.out.println("│ " + nombrePrueba + ": PETICIÓN DE RESERVA ENVIADA");
            System.out.println("│    URL:   " + result.getRequest().getMethod() + " " + result.getRequest().getRequestURI());
            System.out.println("│");
            System.out.println("│ RESPUESTA DEL SERVIDOR/CONTROLADOR:");
            System.out.println("│    Estado HTTP: " + result.getResponse().getStatus());
            System.out.println("│    Body:  " + result.getResponse().getContentAsString(StandardCharsets.UTF_8));
            System.out.println("╰──────────────────────────────────────────────────────────╯\n");
        };
    }

    @Test
    @DisplayName("PRU-08: Intento de reserva en espacio ocupado retorna 409 Conflict")
    void crearReserva_EspacioOcupado_Retorna409() throws Exception {
        System.out.println("\n▶ EJECUTANDO PRU-08: DETECTAR CONFLICTO DE HORARIO EN ESPACIO");

        SolicitudRequestDTO solicitud = new SolicitudRequestDTO();
        solicitud.setIdEspacio(1L);
        solicitud.setHoraInicio(LocalTime.of(10, 0));
        solicitud.setHoraFin(LocalTime.of(11, 0));
        solicitud.setFecha(LocalDate.now().plusDays(1)); // Mañana
        solicitud.setProposito("Estudio de cálculo");
        solicitud.setCantidadIntegrantes(2);

        Mockito.when(solicitudService.crearSolicitud(Mockito.any(SolicitudRequestDTO.class), Mockito.eq("alumno@duocuc.cl")))
                .thenThrow(new ReglaNegocioException("El espacio seleccionado ya tiene reservas en el horario seleccionado.", HttpStatus.CONFLICT));

        Cookie cookieSimulada = new Cookie("token", "mocked-jwt-cookie-value");

        mockMvc.perform(post("/api/solicitudes")
                        .with(csrf())
                        .cookie(cookieSimulada)
                        .characterEncoding("UTF-8")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(solicitud)))
                .andDo(imprimirBonito("PRU-08"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.mensaje").value("El espacio seleccionado ya tiene reservas en el horario seleccionado."))
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    @DisplayName("PRU-09: Crear solicitud válida retorna 201 Created")
    void crearReserva_DatosValidos_Retorna201() throws Exception {
        System.out.println("\n▶ EJECUTANDO PRU-09: CREAR SOLICITUD CON DATOS VÁLIDOS");

        SolicitudRequestDTO solicitud = new SolicitudRequestDTO();
        solicitud.setIdEspacio(1L);
        solicitud.setHoraInicio(LocalTime.of(14, 0));
        solicitud.setHoraFin(LocalTime.of(15, 0));
        solicitud.setFecha(LocalDate.now().plusDays(2)); // Pasado mañana
        solicitud.setProposito("Reunión de proyecto");
        solicitud.setCantidadIntegrantes(4);

        SolicitudResponseDTO respuestaEsperada = SolicitudResponseDTO.builder()
                .idSolicitud(100L)
                .proposito("Reunión de proyecto")
                .estado("PENDIENTE")
                .nombreEspacio("Sala CITT")
                .build();

        Mockito.when(solicitudService.crearSolicitud(Mockito.any(SolicitudRequestDTO.class), Mockito.eq("alumno@duocuc.cl")))
                .thenReturn(respuestaEsperada);

        Cookie cookieSimulada = new Cookie("token", "mocked-jwt-cookie-value");

        mockMvc.perform(post("/api/solicitudes")
                        .with(csrf())
                        .cookie(cookieSimulada)
                        .characterEncoding("UTF-8")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(solicitud)))
                .andDo(imprimirBonito("PRU-09"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idSolicitud").value(100))
                .andExpect(jsonPath("$.proposito").value("Reunión de proyecto"))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"))
                .andExpect(jsonPath("$.nombreEspacio").value("Sala CITT"));
    }

    @Test
    @DisplayName("PRU-11: Pedir mayor stock del que hay retorna 409 Conflict")
    void crearReserva_ExcedeStock_Retorna409() throws Exception {
        System.out.println("\n▶ EJECUTANDO PRU-11: DETECTAR EXCESO DE STOCK SOLICITADO");

        RequerimientoDTO requerimiento = new RequerimientoDTO();
        requerimiento.setIdCategoria(2L);
        requerimiento.setCantidad(50); // Se piden 50

        SolicitudRequestDTO solicitud = new SolicitudRequestDTO();
        solicitud.setHoraInicio(LocalTime.of(14, 0));
        solicitud.setHoraFin(LocalTime.of(15, 0));
        solicitud.setFecha(LocalDate.now().plusDays(2));
        solicitud.setProposito("Reunión de proyecto");
        solicitud.setCantidadIntegrantes(4);
        solicitud.setRequerimientos(List.of(requerimiento));

        Mockito.when(solicitudService.crearSolicitud(Mockito.any(SolicitudRequestDTO.class), Mockito.eq("alumno@duocuc.cl")))
                .thenThrow(new ReglaNegocioException("No hay stock suficiente para COMPUTADORES marca GENERICO. Solicitados: 50, Disponibles: 10", HttpStatus.CONFLICT));

        Cookie cookieSimulada = new Cookie("token", "mocked-jwt-cookie-value");

        mockMvc.perform(post("/api/solicitudes")
                        .with(csrf())
                        .cookie(cookieSimulada)
                        .characterEncoding("UTF-8")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(solicitud)))
                .andDo(imprimirBonito("PRU-11"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.mensaje").value("No hay stock suficiente para COMPUTADORES marca GENERICO. Solicitados: 50, Disponibles: 10"))
                .andExpect(jsonPath("$.status").value(409));
    }
}

