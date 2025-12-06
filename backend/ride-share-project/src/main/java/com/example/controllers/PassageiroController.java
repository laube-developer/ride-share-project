package com.example.controllers;

import com.example.entidades.Passageiro;
import com.example.entidades.Sessao;
import com.example.entidades.GeoLocalizacao;
import com.example.enums.StatusCorridaEnum;
import com.example.enums.CategoriaCorridaEnum;
import com.example.exceptions.EstadoInvalidoException;
import com.example.examples.Resposta;
import com.example.exceptions.UsuarioOuSenhaIncorretosException;
import com.example.exceptions.SaldoInsuficienteException;
import com.example.parametricos.Cadastro;
import com.example.parametricos.CadastroAutenticavel;
import com.example.parametricos.CadastroSessionavel;
import com.example.exceptions.PagamentoPendenteException;
import com.example.dtos.CredenciaisLogin;
import com.example.dtos.SessaoFrontend;
import com.example.entidades.Corrida;
import com.example.exceptions.MetodoPagamentoInexistenteException;
import com.example.entidades.MeioDePagamento;
import com.example.enums.OperacaoPassageiro;

import ch.qos.logback.core.status.Status;

public class PassageiroController {

    // ============ SOLICITAR CORRIDA ============
    public static Resposta solicitarCorrida(
        Passageiro passageiro, 
        GeoLocalizacao origem, 
        GeoLocalizacao destino,
        CategoriaCorridaEnum categoria,
        int precoEstimado
    ) throws EstadoInvalidoException, UsuarioOuSenhaIncorretosException {
        try {
            // 1. Validar passageiro
            if (passageiro == null) {
                throw new UsuarioOuSenhaIncorretosException("Passageiro inválido.");
            }
            
            // 2. Validar se passageiro já tem corrida em andamento
            StatusCorridaEnum statusAtual = StatusCorridaEnum.SOLICITADA; // ajustar conforme sua lógica
            if (statusAtual == StatusCorridaEnum.EM_ANDAMENTO || statusAtual == StatusCorridaEnum.ACEITA) {
                throw new EstadoInvalidoException("Já existe uma corrida em andamento.");
            }
            
            // 3. Validar origem e destino
            if (origem == null || destino == null) {
                throw new EstadoInvalidoException("Origem e destino devem ser informados.");
            }
            
            // 4. Criar nova corrida
            /*int precoEstimado = calcularPrecoEstimado(origem, destino, categoria);*/
            Corrida novaCorrida = new Corrida(
                origem,
                destino,
                precoEstimado,
                categoria,
                StatusCorridaEnum.SOLICITADA,
                null, // motorista será atribuído após match
                passageiro
            );
            
            

            return new Resposta(
                OperacaoPassageiro.SOLICITACAO.getNome(),
                true,
                "Corrida solicitada com sucesso."
            );
            
        } catch (UsuarioOuSenhaIncorretosException e) {
            return new Resposta(OperacaoPassageiro.SOLICITACAO.getNome(), false, e.getMessage());
        } catch (EstadoInvalidoException e) {
            return new Resposta(OperacaoPassageiro.SOLICITACAO.getNome(), false, e.getMessage());
        }
    }

    // ============ CANCELAR CORRIDA ============
    public static Resposta cancelarCorrida(Passageiro passageiro, Corrida corrida) {
        try {
            // 1. Validar passageiro e corrida
            if (passageiro == null || corrida == null) {
                throw new EstadoInvalidoException("Dados inválidos para cancelamento.");
            }
            
            // 2. Verificar se o passageiro é dono da corrida
            if (!corrida.getPassageiro().equals(passageiro)) {
                throw new EstadoInvalidoException("Passageiro não autorizado a cancelar esta corrida.");
            }
            
            // 3. Tentar cancelar
            if (!corrida.cancelar()) {
                throw new EstadoInvalidoException("Não é possível cancelar esta corrida no estado atual.");
            }
            
            return new Resposta(
                OperacaoPassageiro.CANCELAMENTO.getNome(),
                true,
                "Corrida cancelada com sucesso."
            );
            
        } catch (EstadoInvalidoException e) {
            return new Resposta(OperacaoPassageiro.CANCELAMENTO.getNome(), false, e.getMessage());
        }
    }

    // ============ PROCESSAR PAGAMENTO ============
    public static Resposta processarPagamento(
        Passageiro passageiro,
        Corrida corrida,
        MeioDePagamento meioSelecionado
    ) {
        try {
            // 1. Validar passageiro
            if (passageiro == null) {
                throw new UsuarioOuSenhaIncorretosException("Passageiro inválido.");
            }

            // 2. Verificar se a corrida pertence ao passageiro
            if (!corrida.getPassageiro().equals(passageiro)) {
                throw new EstadoInvalidoException("Passageiro não autorizado.");
            }
            
            // 4. Verificar se corrida foi finalizada
            if (corrida.getStatus() != StatusCorridaEnum.CONCLUIDA) {
                throw new EstadoInvalidoException("Corrida deve estar finalizada para processar pagamento.");
            }
            
            // 5. Validar meios de pagamento do passageiro
            if (passageiro.getMeiosDePagamento() == null || passageiro.getMeiosDePagamento().getTamanho() == 0) {
                throw new MetodoPagamentoInexistenteException("Cadastre um meio de pagamento.");
            }
            
            // 6. Definir meio de pagamento (usar selecionado ou padrão)
            MeioDePagamento meioParaPagar = meioSelecionado;
            if (meioParaPagar == null) {
                meioParaPagar = passageiro.getMeioPadrao();
            }
            
            if (meioParaPagar == null) {
                throw new MetodoPagamentoInexistenteException("Selecione um meio de pagamento.");
            }
            
            // 7. Processar pagamento
            int valorCorrida = corrida.getPrecoEstimado();
            if (!meioParaPagar.processarPagamento(valorCorrida)) {
                throw new SaldoInsuficienteException("Saldo insuficiente no meio de pagamento selecionado.");
            }
            
            return new Resposta(
                OperacaoPassageiro.PAGAMENTO.getNome(),
                true,
                "Pagamento processado com sucesso. Valor: R$ " + (valorCorrida / 100.0)
            );
            
        } catch (UsuarioOuSenhaIncorretosException e) {
            return new Resposta(OperacaoPassageiro.PAGAMENTO.getNome(), false, e.getMessage());
        } catch (EstadoInvalidoException e) {
            return new Resposta(OperacaoPassageiro.PAGAMENTO.getNome(), false, e.getMessage());
        } catch (MetodoPagamentoInexistenteException e) {
            return new Resposta(OperacaoPassageiro.PAGAMENTO.getNome(), false, e.getMessage());
        } catch (SaldoInsuficienteException e) {
            return new Resposta(OperacaoPassageiro.PAGAMENTO.getNome(), false, e.getMessage());
        }
    }

    // ============ ADICIONAR MEIO DE PAGAMENTO ============
    public static Resposta adicionarMeioPagamento(
        Passageiro passageiro,
        MeioDePagamento meio
    ) {
        try {
            if (passageiro == null || meio == null) {
                throw new MetodoPagamentoInexistenteException("Dados inválidos.");
            }
            
            passageiro.cadastrarMeioDePagamento(meio);
            
            return new Resposta(
                OperacaoPassageiro.ADICIONAR_MEIO_PAGAMENTO.getNome(),
                true,
                "Meio de pagamento adicionado com sucesso."
            );
            
        } catch (MetodoPagamentoInexistenteException e) {
            return new Resposta(OperacaoPassageiro.ADICIONAR_MEIO_PAGAMENTO.getNome(), false, e.getMessage());
        } catch (Exception e) {
            return new Resposta(OperacaoPassageiro.ADICIONAR_MEIO_PAGAMENTO.getNome(), false, e.getMessage());
        }
    }

    // ============ REMOVER MEIO DE PAGAMENTO ============
    public static Resposta removerMeioPagamento(
        Passageiro passageiro,
        MeioDePagamento meio
    ) {
        try {
            if (passageiro == null || meio == null) {
                throw new MetodoPagamentoInexistenteException("Dados inválidos.");
            }
            
            passageiro.removerMeioDePagamento(meio);
            
            return new Resposta(
                OperacaoPassageiro.REMOVER_MEIO_PAGAMENTO.getNome(),
                true,
                "Meio de pagamento removido com sucesso."
            );
            
        } catch (MetodoPagamentoInexistenteException e) {
            return new Resposta(OperacaoPassageiro.REMOVER_MEIO_PAGAMENTO.getNome(), false, e.getMessage());
        } catch (Exception e) {
            return new Resposta(OperacaoPassageiro.REMOVER_MEIO_PAGAMENTO.getNome(), false, e.getMessage());
        }
    }

    // ============ LISTAR MEIOS DE PAGAMENTO ============
    public static Resposta listarMeiosPagamento(Passageiro passageiro) {
        try {
            if (passageiro == null) {
                throw new UsuarioOuSenhaIncorretosException("Passageiro inválido.");
            }
            
            int totalMeios = passageiro.getMeiosDePagamento() != null ? 
                passageiro.getMeiosDePagamento().getTamanho() : 0;
            
            String mensagem = totalMeios > 0 ? 
                "Total de meios de pagamento: " + totalMeios :
                "Nenhum meio de pagamento cadastrado.";
            
            return new Resposta(
                OperacaoPassageiro.LISTAR_MEIO_PAGAMENTO.getNome(),
                true,
                mensagem
            );
            
        } catch (UsuarioOuSenhaIncorretosException e) {
            return new Resposta(OperacaoPassageiro.LISTAR_MEIO_PAGAMENTO.getNome(), false, e.getMessage());
        }
    }

    // ============ LOGIN ============
    public static Passageiro login(
        CredenciaisLogin credenciais,
        CadastroAutenticavel<Passageiro> cadastro
    ) throws UsuarioOuSenhaIncorretosException {
        
        if (credenciais == null || cadastro == null) {
            throw new UsuarioOuSenhaIncorretosException("Credenciais ou cadastro inválidos.");
        }
        
        Passageiro p = cadastro.buscarPorEmail(credenciais.getEmail());
        if (p == null) {
            throw new UsuarioOuSenhaIncorretosException("Usuário ou senha incorretos.");
        }
        
        if (!p.verificarSenha(credenciais.getSenha())) {
            throw new UsuarioOuSenhaIncorretosException("Usuário ou senha incorretos.");
        }
        
        return p;
    }

    // ============ MÉTODOS AUXILIARES ============
    /*private static int calcularPrecoEstimado(
        GeoLocalizacao origem,
        GeoLocalizacao destino,
        CategoriaCorridaEnum categoria
    ) {
        // TODO: implementar cálculo real de preço baseado em distância e categoria
        // Por enquanto, retorna um valor fixo em centavos
        return 5000; // R$ 50,00
    }*/
}

// if(saldo<0){ // saldo negativo, ele ta devendo
// throw new PagamentoPendenteException("Usuário realize o pagamento de suas pendências.");}

// if(!passageiro.verificarSenha(passageiro.getSenha())){throw new UsuarioOuSenhaIncorretosException("Passageiro ou senha incorretos.");}