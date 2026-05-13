package cl.duoc.citt.citt_backend.security;


import cl.duoc.citt.citt_backend.model.EstadoArticulo;
import cl.duoc.citt.citt_backend.model.EstadoEspacio;
import cl.duoc.citt.citt_backend.repositories.EstadoArticuloRepository;
import cl.duoc.citt.citt_backend.repositories.EstadoEspacioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeedConfig {

    @Bean
    CommandLineRunner initDatabase(EstadoArticuloRepository articuloRepo, EstadoEspacioRepository espacioRepo) {
        return args -> {

            // 1. Inicializar Estados de Artículo
            if (articuloRepo.count() == 0) {
                articuloRepo.saveAll(List.of(
                        new EstadoArticulo(null, "DISPONIBLE"),
                        new EstadoArticulo(null, "PRESTADO"),
                        new EstadoArticulo(null, "DAÑADO"),
                        new EstadoArticulo(null, "MANTENCION")
                ));
                System.out.println("Estados de artículo inicializados con éxito.");
            }

            // 2. Inicializar Estados de Espacio
            if (espacioRepo.count() == 0) {
                espacioRepo.saveAll(List.of(
                        EstadoEspacio.builder().nombre("DISPONIBLE").build(),
                        EstadoEspacio.builder().nombre("DAÑADO").build(),
                        EstadoEspacio.builder().nombre("MANTENCION").build()
                ));
                System.out.println("Estados de espacio inicializados con éxito.");
            }

        };
    }
}