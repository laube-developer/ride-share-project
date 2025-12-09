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

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.controllers.PassageiroController;
import com.example.dtos.requisicao.AdicionarVeiculoRequisicao;
import com.example.dtos.requisicao.CredenciaisLogin;
import com.example.entidades.CNH;
import com.example.entidades.CartaoDeCredito;
import com.example.dtos.requisicao.SolicitacaoCorrida;
import com.example.dtos.requisicao.UpdateCNH;
import com.example.dtos.resposta.RespostaCNH;
import com.example.dtos.resposta.RespostaLogin;
import com.example.dtos.resposta.RespostaMeiosDePagamento;
import com.example.dtos.resposta.RespostaVeiculo;
import com.example.dtos.resposta.Resposta;
import com.example.dtos.resposta.SessaoFrontend;
import com.example.entidades.Corrida;
import com.example.entidades.GeoLocalizacao;
import com.example.entidades.MeioDePagamento;
// Importação de classes do projeto
import com.example.entidades.Motorista;
import com.example.entidades.PIX;
import com.example.entidades.Passageiro;
import com.example.entidades.Sessao;
import com.example.entidades.Veiculo;
import com.example.enums.OperacaoEnum;
import com.example.enums.StatusCorridaEnum;
import com.example.enums.StatusMotoristaEnum;
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

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@SpringBootApplication
@CrossOrigin(origins = "http://localhost:3000")
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
					"merecemos_ss@gmail.com",
					"123",
					"00000000000",
					"00000000000");

			pp.cadastrarMeioDePagamento(
					new CartaoDeCredito("1234-5678-9101-1121", "Rafael Laube", LocalDate.of(2025, 12, 31), 1000));
			pp.cadastrarMeioDePagamento(
					new PIX("rafaellaube11@gmail.com", 500));

			cadastroPassageiro.adicionar(pp);

			Motorista mp = new Motorista(
					"Rafael",
					"merecemos_10@gmail.com",
					"123",
					"00000000000",
					"00000000000");
			mp.setCNH(new CNH("123456", LocalDate.of(2026, 12, 31)));
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
			s.setTokenSessao(novoToken);
			cadastroSessoes.adicionar(s);

			SessaoFrontend sessaoFrontend = new SessaoFrontend(
					passageiroAutenticado.getNome(),
					novoToken,
					passageiroAutenticado.getEmail(),
					"PASSAGEIRO");

			RespostaLogin r = new RespostaLogin(
					sessaoFrontend,
					true,
					"Login realizado com sucesso!");

			return ResponseEntity.ok(r);

		} catch (UsuarioOuSenhaIncorretosException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@PostMapping("/api/validar-sessao")
	ResponseEntity<Object> verificarSessao(@RequestBody SessaoFrontend sessao) {
		try {
			boolean sessaoValida = cadastroSessoes.buscarPorToken(sessao.getSessaoToken()) != null;

			if (!sessaoValida) {
				throw new EstadoInvalidoException("Sessão inválida.");
			}

			Resposta r = new Resposta(OperacaoEnum.VERIFICAR_SESSAO, true, "Verificação de sessão realizada com sucesso.");

			return ResponseEntity.ok().body(r);
		} catch (Exception e) {
			Resposta r = new Resposta(OperacaoEnum.VERIFICAR_SESSAO, false, e.getMessage());

			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(r);
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

	@PostMapping("/api/passageiro/formas-pagamento")
	ResponseEntity<Object> obterFormasPagamento(@RequestBody SessaoFrontend sessao) {
		try {
			String token = sessao.getSessaoToken();
			Sessao s = cadastroSessoes.buscarPorToken(token);

			if (s == null)
				throw new Exception("Sessão inválida.");

			Passageiro passageiro = (Passageiro) cadastroSessoes.buscarPorToken(token).getUsuario();

			for (MeioDePagamento meio : passageiro.getMeiosDePagamento().getList()) {
				if (meio != null) {
					System.out.println(meio.getNomeMeioPagamento());
				}
			}

			RespostaMeiosDePagamento resposta = new RespostaMeiosDePagamento(
					passageiro.getMeiosDePagamento().getList(),
					true, "Meios de pagamento obtidos com sucesso.");

			return ResponseEntity.ok(resposta);

		} catch (Exception e) {
			Resposta r = new Resposta(OperacaoEnum.PASSAGEIRO_OBTER_MEIOS_PAGAMENTO, false, e.getMessage());

			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(r);
		}
	}

	@PostMapping("/api/passageiro/solicitar-corrida")
	ResponseEntity<Object> solicitarCorrida(@RequestBody SolicitacaoCorrida solicitacao) {
		try {
			Corrida c = PassageiroController.solicitarCorrida(
					cadastroPassageiro.buscarPorEmail(solicitacao.getSessao().getEmail()),
					new GeoLocalizacao(
							solicitacao.getOrigem().getLatitude(),
							solicitacao.getOrigem().getLongitude()),
					new GeoLocalizacao(
							solicitacao.getDestino().getLatitude(),
							solicitacao.getDestino().getLongitude()),
					solicitacao.getCategoria(),
					solicitacao.getPrecoEstimado());

			cadastroCorridas.adicionar(c);

			System.out.println("Corrida solicitada: " + c.getCategoria() + " - R$ " + (c.getPrecoEstimado() / 100.0));

			return ResponseEntity.ok(c);
		} catch (PagamentoPendenteException e) {
			return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(e.getMessage());
		} catch (EstadoInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	@PostMapping("/api/passageiro/verificar-corrida-ativa")
	ResponseEntity<Object> verificarCorridaAtiva(@RequestBody SessaoFrontend sessao) {
		try {
			Passageiro passageiro = cadastroPassageiro.buscarPorEmail("merecemos_ss@gmail.com");

			List<Corrida> corridas = cadastroCorridas.getList();
			Corrida corridaAtiva = null;

			if (corridas != null) {
				for (Corrida c : corridas) {
					if (c != null && c.getPassageiro().equals(passageiro)) {
						if (c.getStatus() == StatusCorridaEnum.ACEITA) {
							corridaAtiva = c;
							break;
						}
					}
				}
			}

			if (corridaAtiva != null) {
				return ResponseEntity.ok(true);
			} else {
				return ResponseEntity.ok(false);
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	@PostMapping("/api/motorista/receber-solicitacoes")
	ResponseEntity<Object> receberSolicitacoes(@RequestBody SessaoFrontend sessao) {
		try {
			Sessao s = cadastroSessoes.buscarPorToken(sessao.getSessaoToken());

			System.out.println(s);

			if (s == null) {
				throw new Exception("Sessão inválida.");
			}

			Motorista motorista = (Motorista) s.getUsuario();

			if (motorista.getStatus() != StatusMotoristaEnum.ONLINE) {
				throw new EstadoInvalidoException("Motorista está offline. Fique online para receber solicitações.");
			}

			List<Corrida> corridas = cadastroCorridas.getList();

			Corrida corridaSolicitada = null;

			for (Corrida c : corridas) {
				if (c != null && c.getStatus() == StatusCorridaEnum.SOLICITADA) {
					corridaSolicitada = c;
					break;
				}
			}

			if (corridaSolicitada != null) {
				return ResponseEntity.ok(corridaSolicitada);
			} else {
				return ResponseEntity.ok("Nenhuma solicitação de corrida disponível no momento.");
			}

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
			s.setTokenSessao(novoToken);
			cadastroSessoes.adicionar(s);

			SessaoFrontend sessao = new SessaoFrontend(
					motoristaAutenticado.getNome(),
					novoToken,
					motoristaAutenticado.getEmail(),
					"MOTORISTA");

			RespostaLogin r = new RespostaLogin(
					sessao,
					true,
					"Login realizado com sucesso!");

			return ResponseEntity.ok(r);

		} catch (UsuarioOuSenhaIncorretosException e) {
			Resposta r = new Resposta(OperacaoEnum.MOTORISTA_LOGIN, false, e.getMessage());

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(r);
		} catch (Exception e) {
			Resposta r = new Resposta(OperacaoEnum.MOTORISTA_LOGIN, false, e.getMessage());

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(r);
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

			Resposta r = new Resposta(OperacaoEnum.MOTORISTA_LOGOUT, true, "Logout realizado com sucesso.");

			return ResponseEntity.ok(r);

		} catch (Exception e) {
			Resposta r = new Resposta(OperacaoEnum.MOTORISTA_LOGOUT, false,
					"Falha ao realizar logout: " + e.getMessage());

			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(r);
		}
	}

	@PostMapping("/api/motorista/get-cnh")
	ResponseEntity<Object> getCnh(@RequestBody SessaoFrontend sessao) {
		try {
			String token = sessao.getSessaoToken();

			Sessao s = cadastroSessoes.buscarPorToken(token);

			if (s == null) {
				throw new EstadoInvalidoException("Sessão inválida");
			}

			Motorista motorista = (Motorista) s.getUsuario();

			if (motorista == null) {
				throw new MotoristaInvalidoException("Motorista inválido.");
			}

			CNH carteira = motorista.getCNH();

			if (carteira == null) {
				throw new MotoristaInvalidoException("Motorista não possui CNH cadastrada.");
			}

			DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_LOCAL_DATE;

			RespostaCNH resposta = new RespostaCNH(
					new CNH(
							carteira.getNumero(),
							LocalDate.parse(carteira.getValidade().format(isoFormatter), isoFormatter)),
					true,
					"CNH obtida com sucesso.");

			return ResponseEntity.ok().body(resposta);

		} catch (Exception e) {
			Resposta r = new Resposta(OperacaoEnum.MOTORISTA_CONSULTA_CNH, false, e.getMessage());

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(r);
		}
	}

	@PostMapping("/api/motorista/atualizar-cnh")
	ResponseEntity<Object> atualizarCnh(@RequestBody UpdateCNH dados) {
		try {
			if (dados.getCnh() == null) {
				throw new MotoristaInvalidoException("Insira os dados da CNH antes de salvar.");
			}

			String token = dados.getSessao().getSessaoToken();

			Sessao s = cadastroSessoes.buscarPorToken(token);

			if (s == null) {
				throw new EstadoInvalidoException("Sessão inválida");
			}

			Motorista motorista = (Motorista) s.getUsuario();

			if (motorista == null) {
				throw new MotoristaInvalidoException("Motorista inválido.");
			}

			motorista.setCNH(dados.getCnh());

			return ResponseEntity.ok()
					.body(new Resposta(OperacaoEnum.MOTORISTA_ATUALIZAR_CNH, true, "CNH atualizada com sucesso."));

		} catch (Exception e) {
			Resposta r = new Resposta(OperacaoEnum.MOTORISTA_ATUALIZAR_CNH, false, e.getMessage());

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(r);
		}
	}

	@PostMapping("/api/motorista/get-veiculo-ativo")
	ResponseEntity<Object> atualizarCnh(@RequestBody SessaoFrontend sessao) {
		try {
			String token = sessao.getSessaoToken();

			Sessao s = cadastroSessoes.buscarPorToken(token);

			if (s == null) {
				throw new EstadoInvalidoException("Sessão inválida");
			}

			Motorista motorista = (Motorista) s.getUsuario();

			if (motorista == null) {
				throw new MotoristaInvalidoException("Motorista inválido.");
			}

			Veiculo v = motorista.getVeiculoAtivo();

			if (v == null) {
				throw new Exception("Motorista não possui veículo ativo.");
			}

			RespostaVeiculo r = new RespostaVeiculo(v, true, "Veiculo carregado com sucesso!");

			return ResponseEntity.ok().body(r);

		} catch (Exception e) {
			Resposta r = new Resposta(OperacaoEnum.MOTORISTA_BUSCAR_VEICULO_ATIVO, false, e.getMessage());

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(r);
		}
	}

	@PostMapping("/api/motorista/adicionar-veiculo")
	ResponseEntity<Object> adicionarVeiculo(@RequestBody AdicionarVeiculoRequisicao requisicao) {
		try {
			String token = requisicao.getSessao().getSessaoToken();

			Sessao s = cadastroSessoes.buscarPorToken(token);

			if (s == null) {
				throw new EstadoInvalidoException("Sessão inválida");
			}

			Motorista motorista = (Motorista) s.getUsuario();

			if (motorista == null) {
				throw new MotoristaInvalidoException("Motorista inválido.");
			}

			if (requisicao.getVeiculo() == null) {
				throw new Exception("Insira os dados do veículo antes de salvar.");
			}

			MotoristaController.adicionarVeiculo(motorista, requisicao.getVeiculo());

			System.out.println("Documentacao: " + requisicao.getVeiculo().isDocumentacaoValida());

			return ResponseEntity.ok().body(true);

		} catch (MotoristaInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e.getMessage());
		}
	}

	@PostMapping("/api/motorista/ficar-online")
	ResponseEntity<Object> motoristaFicarOnline(@RequestBody SessaoFrontend sessao) {
		try {
			String token = sessao.getSessaoToken();

			Sessao s = cadastroSessoes.buscarPorToken(token);

			if (s == null) {
				throw new EstadoInvalidoException("Sessão inválida");
			}

			Motorista motorista = (Motorista) s.getUsuario();

			MotoristaController.ficarOnline(motorista);

			return ResponseEntity.ok("Motorista ficou online com sucesso.");

		} catch (MotoristaInvalidoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
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
			Motorista motorista = (Motorista) cadastroSessoes.buscarPorToken(solicitacao.getSessao().getSessaoToken())
					.getUsuario();
			// TODO: Buscar a corrida solicitada
			Corrida corrida = null; // cadastroCorridas.buscarPorStatus(StatusCorridaEnum.SOLICITADA);

			MotoristaController.aceitarCorrida(motorista, corrida);

			// se a corrida foi localizada, retornamos o objeto corrida para que o
			// passageiro e o motorista vejam os detalhes
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
			Motorista motorista = (Motorista) cadastroSessoes.buscarPorToken(solicitacao.getSessao().getSessaoToken())
					.getUsuario();
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
			Motorista motorista = (Motorista) cadastroSessoes.buscarPorToken(solicitacao.getSessao().getSessaoToken())
					.getUsuario();
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
			Motorista motorista = (Motorista) cadastroSessoes.buscarPorToken(solicitacao.getSessao().getSessaoToken())
					.getUsuario();
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