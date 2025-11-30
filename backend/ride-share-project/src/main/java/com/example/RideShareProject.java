package com.example;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.controllers.PassageiroController;
import com.example.dtos.RespostaLogin;
import com.example.entidades.CadastroAutenticavel;
import com.example.entidades.CadastroSessionavel;
import com.example.entidades.CredenciaisLogin;
// Importação de classes do projeto
import com.example.entidades.Motorista;
import com.example.entidades.Passageiro;
import com.example.exceptions.UsuarioOuSenhaIncorretosException;
import com.example.parametricos.Cadastro;
import com.example.entidades.Sessao;
import com.example.enums.CategoriaUsuarioEnum;

import java.util.UUID;

@RestController
@SpringBootApplication
public class RideShareProject {

	private CadastroAutenticavel<Passageiro> cadastroPassageiro;
	private CadastroAutenticavel<Motorista> cadastroMotorista;
	private CadastroSessionavel<Sessao> cadastroSessoes;

	@Bean
	public CadastroAutenticavel<Passageiro> cadastroPassageiro(){
		this.cadastroPassageiro = new CadastroAutenticavel<Passageiro>(20);
		return this.cadastroPassageiro;
	}

	@Bean
	public CadastroAutenticavel<Motorista> cadastroMotorista(){
		this.cadastroMotorista = new CadastroAutenticavel<Motorista>(20);
		return this.cadastroMotorista;
	}

	@Bean
	public CadastroSessionavel<Sessao> cadastroSessoes(){
		this.cadastroSessoes = new CadastroSessionavel<>(100);
		return this.cadastroSessoes;
	}

	@Bean
	public CommandLineRunner inicializarDadosPadrao() {
		return args -> {
			System.out.println("Inicializando dados padrão de cadastro (Usuarios)");

			Passageiro pp = new Passageiro(
				"Rafael",
				"rafaellaube11@gmail.com",
				"Senha1234",
				"00000000000",
				"00000000000");
			cadastroPassageiro.adicionar(pp);

			Motorista mp = new Motorista(
				"Rafael",
				"rafaellaube11@gmail.com",
				"Senha1234",
				"00000000000",
				"00000000000");
			cadastroMotorista.adicionar(mp);
		};
	}

	@RequestMapping("/")
	String home() {
		return "Ride Share Project Api - Spring Boot";
	}

	@PostMapping("/api/passageiro/login")
	ResponseEntity<Object> passageiroLogin(@RequestBody CredenciaisLogin credenciais){
		try {
			Passageiro passageiroAutenticado = PassageiroController.login(credenciais, cadastroPassageiro);

			String novoToken = UUID.randomUUID().toString();

			if (cadastroSessoes.temSessaoAtiva(credenciais.getEmail())){
				Sessao s = cadastroSessoes.getSessao(credenciais.getEmail());
				cadastroSessoes.remover(s);
			}

			RespostaLogin resposta = new RespostaLogin(
				passageiroAutenticado.getNome(),
				novoToken,
				passageiroAutenticado.getEmail(),
				CategoriaUsuarioEnum.PASSAGEIRO
			);

			return ResponseEntity.ok(resposta);
		} catch (UsuarioOuSenhaIncorretosException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario ou senha incorretos");
		}
	}

	public static void main(String[] args) {
		SpringApplication.run(RideShareProject.class, args);

	}

}