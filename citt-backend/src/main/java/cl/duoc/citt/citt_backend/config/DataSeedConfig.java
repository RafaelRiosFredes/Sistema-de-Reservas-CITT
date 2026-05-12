package cl.duoc.citt.citt_backend.config;


import cl.duoc.citt.citt_backend.model.EstadoEspacio;
import cl.duoc.citt.citt_backend.repositories.EstadoEspacioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class DataSeedConfig {
    @Bean
    CommandLineRunner initEstados(EstadoEspacioRepository repository) {
        return args -> {

            if (repository.count() == 0) {

                repository.save(EstadoEspacio.builder()
                        .nombre("DISPONIBLE")
                        .build());


                repository.save(EstadoEspacio.builder()
                        .nombre("DAÑADO")
                        .build());


                repository.save(EstadoEspacio.builder()
                        .nombre("MANTENCION")
                        .build());
                System.out.println("Estados de espacio inicializados con éxito.");

            }
        };
    }
}