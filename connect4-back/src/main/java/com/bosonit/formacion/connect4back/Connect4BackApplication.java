package com.bosonit.formacion.connect4back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@SpringBootApplication
@EnableR2dbcRepositories
public class Connect4BackApplication {

	public static void main(String[] args) {
		SpringApplication.run(Connect4BackApplication.class, args);
	}

}
