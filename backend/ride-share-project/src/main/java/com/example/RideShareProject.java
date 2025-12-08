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
import com.example.enums.StatusCorridaEnum;
import com.example.exceptions.EstadoInvalidoException;
import com.example.exceptions.UsuarioOuSenhaIncorretosException;
import com.example.exceptions.PagamentoPendenteException;
import com.example.exceptions.MetodoPagamentoInexistenteException;
import com.example.exceptions.SaldoInsuficienteException;
import com.example.exceptions.MotoristaInvalidoException;
import com.example.parametricos.Cadastro;
import com.example.parametricos.CadastroAutenticavel;
import com.example.parametricos.CadastroSessionavel;
import com.example.controllers.MotoristaController;

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
					solicitacao.getOrigem().getLongitude()
				),
				new GeoLocalizacao(
					solicitacao.getDestino().getLatitude(),
					solicitacao.getDestino().getLongitude()
				),
				solicitacao.getCategoria(),
				solicitacao.getPrecoEstimado()
			);

			cadastroCorridas.adicionar(c);

			return ResponseEntity.ok(c);
        } catch (PagamentoPendenteException e) {
			return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(e.getMessage());
		} catch (EstadoInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	@PostMapping("/api/passageiro/cancelar-corrida")
	ResponseEntity<Object> cancelarCorrida(@RequestBody SolicitacaoCorrida solicitacao) {
		try {
			Passageiro passageiro = cadastroPassageiro.buscarPorEmail(solicitacao.getSessao().getEmail());
			Corrida corrida = buscarCorridaAtivaPorPassageiro(passageiro);

			PassageiroController.cancelarCorrida(passageiro, corrida);

			return ResponseEntity.ok("Corrida cancelada com sucesso.");

		} catch (EstadoInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	@PostMapping("/api/passageiro/processar-pagamento")
	ResponseEntity<Object> processarPagamento(@RequestBody SolicitacaoCorrida solicitacao) {
		try {
			Passageiro passageiro = cadastroPassageiro.buscarPorEmail(solicitacao.getSessao().getEmail());
			Corrida corrida = buscarCorridaConcluídaPorPassageiro(passageiro);

			PassageiroController.processarPagamento(passageiro, corrida, null);

			return ResponseEntity.ok("Pagamento processado com sucesso.");

		} catch (EstadoInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (MetodoPagamentoInexistenteException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (SaldoInsuficienteException e) {
			return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	// ============ MOTORISTA ENDPOINTS ============

	@PostMapping("/api/motorista/login")
	ResponseEntity<Object> motoristaLogin(@RequestBody CredenciaisLogin credenciais) {
		try {
			Motorista motoristaAutenticado = MotoristaController.login(credenciais, cadastroMotorista);

			String novoToken = UUID.randomUUID().toString();

			if (cadastroSessoes.temSessaoAtiva(credenciais.getEmail())) {
				Sessao s = cadastroSessoes.getSessao(credenciais.getEmail());
				cadastroSessoes.removerSessoesAbertas(s.getUsuario().getEmail());
			}

			Sessao s = new Sessao();
			s.setUsuario(motoristaAutenticado);
			cadastroSessoes.adicionar(s);

			SessaoFrontend resposta = new SessaoFrontend(
				motoristaAutenticado.getNome(),
				novoToken,
				motoristaAutenticado.getEmail(),
				"MOTORISTA",
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

	@PostMapping("/api/motorista/logout")
	ResponseEntity<Object> motoristaLogout(@RequestBody SessaoFrontend sessao) {
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

	@PostMapping("/api/motorista/ficar-online")
	ResponseEntity<Object> motoristaFicarOnline(@RequestBody SessaoFrontend sessao) {
		try {
			Motorista motorista = (Motorista) cadastroSessoes.buscarPorToken(sessao.getSessaoToken()).getUsuario();

			MotoristaController.ficarOnline(motorista);

			return ResponseEntity.ok("Motorista ficou online com sucesso.");

		} catch (MotoristaInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (UsuarioOuSenhaIncorretosException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	@PostMapping("/api/motorista/ficar-offline")
	ResponseEntity<Object> motoristaFicarOffline(@RequestBody SessaoFrontend sessao) {
		try {
			Motorista motorista = (Motorista) cadastroSessoes.buscarPorToken(sessao.getSessaoToken()).getUsuario();

			MotoristaController.ficarOffline(motorista);

			return ResponseEntity.ok("Motorista ficou offline com sucesso.");

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	@PostMapping("/api/motorista/aceitar-corrida")
	ResponseEntity<Object> motoristaAceitarCorrida(@RequestBody SolicitacaoCorrida solicitacao) {
		try {
			Motorista motorista = (Motorista) cadastroSessoes.buscarPorToken(solicitacao.getSessao().getSessaoToken()).getUsuario();
			// TODO: Buscar a corrida solicitada
			Corrida corrida = null; // cadastroCorridas.buscarPorStatus(StatusCorridaEnum.SOLICITADA);

			MotoristaController.aceitarCorrida(motorista, corrida);

			// se a corrida foi localizada, retornamos o objeto corrida para que o passageiro e o motorista vejam os detalhes
			if (corrida != null) {
				return ResponseEntity.ok(corrida);
			}
			return ResponseEntity.ok("Corrida aceita com sucesso.");

		} catch (EstadoInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (MotoristaInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	@PostMapping("/api/motorista/iniciar-corrida")
	ResponseEntity<Object> motoristaIniciarCorrida(@RequestBody SolicitacaoCorrida solicitacao) {
		try {
			Motorista motorista = (Motorista) cadastroSessoes.buscarPorToken(solicitacao.getSessao().getSessaoToken()).getUsuario();
			// TODO: Buscar a corrida aceita do motorista
			Corrida corrida = null; // cadastroCorridas.buscarPorMotorista(motorista);

			MotoristaController.iniciarCorrida(motorista, corrida);

			return ResponseEntity.ok("Corrida iniciada com sucesso.");

		} catch (EstadoInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	@PostMapping("/api/motorista/finalizar-corrida")
	ResponseEntity<Object> motoristaFinalizarCorrida(@RequestBody SolicitacaoCorrida solicitacao) {
		try {
			Motorista motorista = (Motorista) cadastroSessoes.buscarPorToken(solicitacao.getSessao().getSessaoToken()).getUsuario();
			// TODO: Buscar a corrida em andamento do motorista
			Corrida corrida = null; // cadastroCorridas.buscarPorMotorista(motorista);

			MotoristaController.finalizarCorrida(motorista, corrida);

			return ResponseEntity.ok("Corrida finalizada com sucesso.");

		} catch (EstadoInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	@PostMapping("/api/motorista/cancelar-corrida")
	ResponseEntity<Object> motoristaCancelarCorrida(@RequestBody SolicitacaoCorrida solicitacao) {
		try {
			Motorista motorista = (Motorista) cadastroSessoes.buscarPorToken(solicitacao.getSessao().getSessaoToken()).getUsuario();
			// TODO: Buscar a corrida do motorista
			Corrida corrida = null; // cadastroCorridas.buscarPorMotorista(motorista);

			MotoristaController.cancelarCorrida(motorista, corrida);

			return ResponseEntity.ok("Corrida cancelada com sucesso.");

		} catch (EstadoInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	// ============ MÉTODOS AUXILIARES PARA BUSCAR CORRIDAS ============
	
	/**
	 * Busca uma corrida ativa (SOLICITADA ou ACEITA) do passageiro.
	 * Retorna null se nenhuma for encontrada.
	 */
	private Corrida buscarCorridaAtivaPorPassageiro(Passageiro passageiro) {
		if (passageiro == null || cadastroCorridas == null) {
			return null;
		}
		
		for (int i = 0; i < cadastroCorridas.getTamanho(); i++) {
			Corrida c = cadastroCorridas.buscarPorId(i);
			if (c != null && c.getPassageiro().equals(passageiro)) {
				// Retorna se está SOLICITADA ou ACEITA
				if (c.getStatus() != StatusCorridaEnum.CONCLUIDA && 
					c.getStatus() != StatusCorridaEnum.CANCELADA) {
					return c;
				}
			}
		}
		return null;
	}
	
	/**
	 * Busca uma corrida concluída (CONCLUIDA) do passageiro.
	 * Retorna null se nenhuma for encontrada.
	 */
	private Corrida buscarCorridaConcluídaPorPassageiro(Passageiro passageiro) {
		if (passageiro == null || cadastroCorridas == null) {
			return null;
		}
		
		for (int i = 0; i < cadastroCorridas.getTamanho(); i++) {
			Corrida c = cadastroCorridas.buscarPorId(i);
			if (c != null && c.getPassageiro().equals(passageiro)) {
				if (c.getStatus() == StatusCorridaEnum.CONCLUIDA) {
					return c;
				}
			}
		}
		return null;
	}
	
	/**
	 * Busca uma corrida ativa (ACEITA) do motorista.
	 * Retorna null se nenhuma for encontrada.
	 */
	private Corrida buscarCorridaAtivaPorMotorista(Motorista motorista) {
		if (motorista == null || cadastroCorridas == null) {
			return null;
		}
		
		for (int i = 0; i < cadastroCorridas.getTamanho(); i++) {
			Corrida c = cadastroCorridas.buscarPorId(i);
			if (c != null && c.getMotorista() != null && c.getMotorista().equals(motorista)) {
				if (c.getStatus() == StatusCorridaEnum.ACEITA || 
					c.getStatus() == StatusCorridaEnum.EM_ANDAMENTO) {
					return c;
				}
			}
		}
		return null;
	}
}