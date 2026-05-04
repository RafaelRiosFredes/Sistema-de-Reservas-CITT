package cl.duoc.citt.citt_backend.config;

import cl.duoc.citt.citt_backend.model.EstadoArticulo;
import cl.duoc.citt.citt_backend.repositories.EstadoArticuloRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeedConfig {
    @Bean
    CommandLineRunner inicializarEstados(EstadoArticuloRepository repository){
        return args -> {
            if(repository.count() == 0){
                repository.saveAll(List.of(
                        new EstadoArticulo(null,"Disponible"),
                        new EstadoArticulo(null,"Prestado"),
                        new EstadoArticulo(null,"Pendiente"),
                        new EstadoArticulo(null,"Atrasado"),
                        new EstadoArticulo(null,"Dañado")
                ));
                System.out.println("Estados de artículo inicializados con éxito.");
            }
        };
    }
}
