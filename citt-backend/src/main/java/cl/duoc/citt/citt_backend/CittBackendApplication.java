package cl.duoc.citt.citt_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CittBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CittBackendApplication.class, args);
	}

}
