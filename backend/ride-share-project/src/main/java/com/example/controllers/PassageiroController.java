package com.example.controllers;

import com.example.entidades.Passageiro;
import com.example.enums.StatusCorridaEnum;
import com.example.exceptions.EstadoInvalidoException;
import com.example.examples.Operacao;
import com.example.exceptions.UsuarioouSenhaIncorretosException;
import com.example.exceptions.SaldoInsuficienteException;
import com.example.exceptions.PagamentoPendenteException;
import com.example.entidades.Corrida;
import com.example.exceptions.MetodoPagamentoInexistenteException;
import com.example.entidades.MeioDePagamento;

import ch.qos.logback.core.status.Status;

public class PassageiroController {
    private static final String NOME_OPERACAO = "ficar-disponivel";

    public static Operacao processarPagamento(MeioDePagamento meioPadrao, Corrida corrida, Passageiro passageiro, int valorParaPagar, int saldo) throws SaldoInsuficienteException, PagamentoPendenteException, UsuarioouSenhaIncorretosException, EstadoInvalidoException, MetodoPagamentoInexistenteException {
        try {
            if (passageiro == null || !passageiro.verificarSenha(passageiro.getSenha())) {
                throw new UsuarioouSenhaIncorretosException("Usuário ou senha incorretos.");           
            }
            if (saldo < 0){ //saldo negativo, ele ta devendo
                throw new PagamentoPendenteException("Usuário realize o pagamento de suas pendências.");
            }
            if (saldo < valorParaPagar) { //tem mais dinheiro do que de quem deve, mas não tem dinheiro igual
                throw new SaldoInsuficienteException("Saldo Insuficiente, escolha outra forma de pagamento.");
            }
            if (meioPadrao == null) { // o cara acha q vamos pagar a corrida dele assim na alta po
                throw new MetodoPagamentoInexistenteException("Cadastre pelo menos um meio de pagamento.");
            }
            StatusCorridaEnum status = corrida.getStatus();
            if (status == StatusCorridaEnum.EM_ANDAMENTO || status == StatusCorridaEnum.ACEITA) { //o cara ta pensanndo no futuro já, pedindo a proxima corrida, calma calabreso
                throw new EstadoInvalidoException("Já existe uma corrida em andamento.");
            } //iniciar corrida já estando em uma

            
            //if (meioPadrao(processarPagamento(valorParaPagar)) && corrida.getStatus() == StatusCorridaEnum.EM_ANDAMENTO) {
            //    throw new EstadoInvalidoException("Passageiro ja esta em uma corrida.");
            //} //passageiro tentar pagar a corrida antes de finalizar a corrida (menor ideia do que fazer aqui)

            boolean temPagamento = passageiro.getMeiosDePagamento() != null
                && passageiro.getMeiosDePagamento().getTamanho() > 0;

            if (!temPagamento) {
                throw new MetodoPagamentoInexistenteException("Cadastre pelo menos um meio de pagamento.");
            }
            // If all checks pass, return a successful Operacao
            return new Operacao(NOME_OPERACAO, true, "Passageiro ficou disponível com sucesso.");
        } catch (UsuarioouSenhaIncorretosException e) {
            return new Operacao(NOME_OPERACAO, false, e.getMessage());
        } catch (PagamentoPendenteException e) {
            return new Operacao(NOME_OPERACAO, false, e.getMessage());
        } catch (SaldoInsuficienteException e) {
            return new Operacao(NOME_OPERACAO, false, e.getMessage());
        } catch (MetodoPagamentoInexistenteException e) {
            return new Operacao(NOME_OPERACAO, false, e.getMessage());
        } catch (EstadoInvalidoException e) {
            return new Operacao(NOME_OPERACAO, false, "Erro ao atualizar status do passageiro.");
        }
    }
}
