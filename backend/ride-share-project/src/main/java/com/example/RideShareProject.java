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
import com.example.dtos.requisicao.CredenciaisLogin;
import com.example.dtos.requisicao.SolicitacaoCorrida;
import com.example.dtos.resposta.Resposta;
import com.example.dtos.resposta.SessaoFrontend;
import com.example.entidades.Corrida;
import com.example.entidades.GeoLocalizacao;
// Importação de classes do projeto
import com.example.entidades.Motorista;
import com.example.entidades.Passageiro;
import com.example.entidades.Sessao;
import com.example.enums.OperacaoEnum;
import com.example.exceptions.EstadoInvalidoException;
import com.example.exceptions.UsuarioOuSenhaIncorretosException;
import com.example.parametricos.Cadastro;
import com.example.parametricos.CadastroAutenticavel;
import com.example.parametricos.CadastroSessionavel;

import java.util.UUID;

@RestController
@SpringBootApplication
public class RideShareProject {

	private CadastroAutenticavel<Passageiro> cadastroPassageiro;
	private CadastroAutenticavel<Motorista> cadastroMotorista;
	private CadastroSessionavel<Sessao> cadastroSessoes;
	private Cadastro<Corrida> cadastroCorridas;

	@Bean
	public CadastroAutenticavel<Passageiro> cadastroPassageiro() {
		this.cadastroPassageiro = new CadastroAutenticavel<Passageiro>(20);
		return this.cadastroPassageiro;
	}

	@Bean
	public CadastroAutenticavel<Motorista> cadastroMotorista() {
		this.cadastroMotorista = new CadastroAutenticavel<Motorista>(20);
		return this.cadastroMotorista;
	}

	@Bean
	public CadastroSessionavel<Sessao> cadastroSessoes() {
		this.cadastroSessoes = new CadastroSessionavel<Sessao>(100);
		return this.cadastroSessoes;
	}

	@Bean
	public Cadastro<Corrida> cadastroCorrida() {
		this.cadastroCorridas = new Cadastro<Corrida>(1000);
		return this.cadastroCorridas;
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

	public static void main(String[] args) {
		SpringApplication.run(RideShareProject.class, args);
	}

	@RequestMapping("/")
	String home() {
		return "Ride Share Project Api - Spring Boot";
	}

	@PostMapping("/api/passageiro/login")
	ResponseEntity<Object> passageiroLogin(@RequestBody CredenciaisLogin credenciais) {
		try {
			Passageiro passageiroAutenticado = PassageiroController.login(credenciais, cadastroPassageiro);

			String novoToken = UUID.randomUUID().toString();

			if (cadastroSessoes.temSessaoAtiva(credenciais.getEmail())) {
				Sessao s = cadastroSessoes.getSessao(credenciais.getEmail());
				cadastroSessoes.removerSessoesAbertas(s.getUsuario().getEmail());
			}

			Sessao s = new Sessao();
			s.setUsuario(passageiroAutenticado);
			cadastroSessoes.adicionar(s);

			SessaoFrontend resposta = new SessaoFrontend(
					passageiroAutenticado.getNome(),
					novoToken,
					passageiroAutenticado.getEmail(),
					"PASSAGEIRO",
					true,
					"Login realizado com sucesso!"
			);

			return ResponseEntity.ok(resposta);

		} catch (UsuarioOuSenhaIncorretosException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@PostMapping("/api/passageiro/logout")
	ResponseEntity<Object> passageiroLogout(@RequestBody SessaoFrontend sessao) {
		try {
			if (cadastroSessoes.temSessaoAtiva(sessao.getEmail())) {
				boolean ok = cadastroSessoes.removerSessao(sessao.getSessaoToken(), sessao.getEmail());

				if (!ok)
					throw new Exception("Falha ao fazer logout");
			}

			return ResponseEntity.ok("");

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	@PostMapping("/api/passageiro/solicitar-corrida")
	ResponseEntity<Object> solicitarCorrida(@RequestBody SolicitacaoCorrida solicitacao) {
		try {
			Corrida c = PassageiroController.solicitarCorrida(
				cadastroPassageiro.buscarPorEmail(solicitacao.getSessao().getEmail()),
				new GeoLocalizacao(
					solicitacao.getOrigem().getLatitude(), 
					solicitacao.getOrigem().getLatitude()
				),
				new GeoLocalizacao(
					solicitacao.getDestino().getLatitude(), 
					solicitacao.getDestino().getLatitude()
				),
				solicitacao.getCategoria(),
				solicitacao.getPrecoEstimado()
			);

			cadastroCorridas.adicionar(c);

			return ResponseEntity.ok(c);
        } catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}
}