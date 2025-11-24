package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Importação de classes do projeto
import main.java.com.example.entidades.Motorista;

@RestController
@SpringBootApplication
public class RideShareProject {

	@RequestMapping("/")
	String home() {
		Motorista motorista = new Motorista(
	    		"Rafael",
	    		"rafaellaube11@gmail.com",
	    		"Senha1234",
	    		"00000000000",
	    		"00000000000"
				);
		
		return motorista.toString();
	}

	public static void main(String[] args) {
		SpringApplication.run(RideShareProject.class, args);
	}

}