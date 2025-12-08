package com.example.controllers;

import com.example.dtos.requisicao.CredenciaisLogin;
import com.example.dtos.resposta.SessaoFrontend;
import com.example.entidades.Corrida;
import com.example.entidades.GeoLocalizacao;
import com.example.entidades.MeioDePagamento;
import com.example.entidades.Passageiro;
import com.example.entidades.Sessao;
import com.example.enums.CategoriaCorridaEnum;
import com.example.enums.StatusCorridaEnum;
import com.example.exceptions.PagamentoPendenteException;
import com.example.exceptions.UsuarioOuSenhaIncorretosException;
import com.example.exceptions.EstadoInvalidoException;
import com.example.exceptions.MetodoPagamentoInexistenteException;
import com.example.exceptions.MetodoDePagamentoDuplicadoException;
import com.example.exceptions.SaldoInsuficienteException;
import com.example.parametricos.CadastroAutenticavel;
import com.example.parametricos.CadastroSessionavel;

/**
 * PassageiroController - Camada de controle para operações de passageiro
 * O tratamento de exceções é feito na classe RideShareProject.java
 */
public class PassageiroController {
    public static boolean verificarSessao(
        CadastroSessionavel<Sessao> cadastroSessoes,
        SessaoFrontend sessaoPassageiro
    ) {
        return cadastroSessoes.buscarPorToken(sessaoPassageiro.getSessaoToken()) != null;
    }

    public static Corrida solicitarCorrida(
        Passageiro passageiro,
        GeoLocalizacao origem,
        GeoLocalizacao destino,
        CategoriaCorridaEnum categoria,
        int precoEstimado
    ) throws EstadoInvalidoException, PagamentoPendenteException {

        if (origem == null || destino == null) {
            throw new EstadoInvalidoException("Origem e destino devem ser informados.");
        }

        // Verificar se o passageiro tem saldo negativo (débitos pendentes)
        if (passageiro.getSaldo() < 0) {
            throw new PagamentoPendenteException("Usuário realize o pagamento de suas pendências.");
        }

        // Criar e retornar a corrida
        Corrida novaCorrida = new Corrida(
            origem,
            destino,
            precoEstimado,
            categoria,
            StatusCorridaEnum.SOLICITADA,
            null,
            passageiro
        );

        return novaCorrida;
    }

    public static void cancelarCorrida(Passageiro passageiro, Corrida corrida) 
        throws EstadoInvalidoException {
        
        if (passageiro == null || corrida == null) {
            throw new EstadoInvalidoException("Dados inválidos para cancelamento.");
        }

        if (!corrida.getPassageiro().equals(passageiro)) {
            throw new EstadoInvalidoException("Passageiro não autorizado a cancelar esta corrida.");
        }

        if (!corrida.cancelar()) {
            throw new EstadoInvalidoException("Não é possível cancelar esta corrida no estado atual.");
        }
    }

    public static void processarPagamento(
        Passageiro passageiro,
        Corrida corrida,
        MeioDePagamento meioSelecionado
    ) throws EstadoInvalidoException, MetodoPagamentoInexistenteException, SaldoInsuficienteException {

        if (!corrida.getPassageiro().equals(passageiro)) {
            throw new EstadoInvalidoException("Passageiro não autorizado.");
        }

        if (corrida.getStatus() != StatusCorridaEnum.CONCLUIDA) {
            throw new EstadoInvalidoException("Corrida deve estar finalizada para processar pagamento.");
        }

        if (passageiro.getMeiosDePagamento() == null || passageiro.getMeiosDePagamento().getTamanho() == 0) {
            throw new MetodoPagamentoInexistenteException("Cadastre um meio de pagamento.");
        }

        MeioDePagamento meioParaPagar = meioSelecionado;
        if (meioParaPagar == null) {
            meioParaPagar = passageiro.getMeioPadrao();
        }

        if (meioParaPagar == null) {
            throw new MetodoPagamentoInexistenteException("Selecione um meio de pagamento.");
        }

        int valorCorrida = corrida.getPrecoEstimado();
        if (!meioParaPagar.processarPagamento(valorCorrida)) {
            throw new SaldoInsuficienteException("Saldo insuficiente no meio de pagamento selecionado.");
        }
    }

    public static void adicionarMeioPagamento(
        Passageiro passageiro,
        MeioDePagamento meio
    ) throws MetodoPagamentoInexistenteException, MetodoDePagamentoDuplicadoException {
        
        if (passageiro == null || meio == null) {
            throw new MetodoPagamentoInexistenteException("Dados inválidos.");
        }

        // Verificar se já existe um método de pagamento do mesmo tipo cadastrado
        if (passageiro.getMeiosDePagamento() != null && passageiro.getMeiosDePagamento().getTamanho() > 0) {
            for (int i = 0; i < passageiro.getMeiosDePagamento().getTamanho(); i++) {
                MeioDePagamento meioExistente = passageiro.getMeiosDePagamento().buscarPorId(i);
                if (meioExistente.getClass().equals(meio.getClass())) {
                    throw new MetodoDePagamentoDuplicadoException(
                        "Já existe um " + meio.getClass().getSimpleName() + " cadastrado."
                    );
                }
            }
        }

        passageiro.cadastrarMeioDePagamento(meio);
    }

    public static void removerMeioPagamento(
        Passageiro passageiro,
        MeioDePagamento meio
    ) throws MetodoPagamentoInexistenteException {
        
        if (passageiro == null || meio == null) {
            throw new MetodoPagamentoInexistenteException("Dados inválidos.");
        }

        passageiro.removerMeioDePagamento(meio);
    }

    public static int listarMeiosPagamento(Passageiro passageiro) 
        throws MetodoPagamentoInexistenteException {

        if (passageiro.getMeiosDePagamento() == null) {
            throw new MetodoPagamentoInexistenteException("Nenhum método de pagamento cadastrado.");
        }
        
        return passageiro.getMeiosDePagamento() != null ? 
            passageiro.getMeiosDePagamento().getTamanho() : 0;
    }

    public static Passageiro login(
        CredenciaisLogin credenciais,
        CadastroAutenticavel<Passageiro> cadastro
    ) throws UsuarioOuSenhaIncorretosException {

        if (credenciais == null || cadastro == null) {
            throw new UsuarioOuSenhaIncorretosException("Usuário ou senha incorretos.");
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
}