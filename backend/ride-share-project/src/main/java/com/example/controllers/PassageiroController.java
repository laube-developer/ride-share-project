package com.example.controllers;

import com.example.entidades.Passageiro;
import com.example.enums.StatusCorridaEnum;
import com.example.exceptions.EstadoInvalidoException;
import com.example.examples.Resposta;
import com.example.exceptions.PassageiroInvalidoException;
import com.example.exceptions.SaldoInsuficienteException;
import com.example.exceptions.UsuarioOuSenhaIncorretosException;
import com.example.parametricos.Cadastro;
import com.example.exceptions.PagamentoPendenteException;
import com.example.entidades.CadastroAutenticavel;
import com.example.entidades.Corrida;
import com.example.entidades.CredenciaisLogin;
import com.example.exceptions.MetodoPagamentoInexistenteException;
import com.example.entidades.MeioDePagamento;

import ch.qos.logback.core.status.Status;



//Nao sei se devo adicionar o UsuarioouSenhaIncorretosException aqui...

public class PassageiroController {
    private static final String NOME_OPERACAO = "ficar-disponivel";

    public static Resposta processarPagamento(MeioDePagamento meioPadrao, Corrida corrida, Passageiro passageiro, int valorParaPagar, int saldo) throws SaldoInsuficienteException, PagamentoPendenteException, PassageiroInvalidoException, EstadoInvalidoException, MetodoPagamentoInexistenteException {
        try {
            if (passageiro == null) {
                throw new PassageiroInvalidoException("Passageiro nao informado.");            
            }
            if (saldo < 0){ //saldo negativo, ele ta devendo
                throw new PagamentoPendenteException();
            }
            if (saldo < valorParaPagar) { //tem mais dinheiro do que de quem deve, mas não tem dinheiro igual
                throw new SaldoInsuficienteException();
            }
            if (meioPadrao == null) { // o cara acha q vamos pagar a corrida dele assim na alta po
                throw new MetodoPagamentoInexistenteException();
            }
            StatusCorridaEnum status = corrida.getStatus();
            if (status == StatusCorridaEnum.EM_ANDAMENTO || status == StatusCorridaEnum.ACEITA) { //o cara ta pensanndo no futuro já, pedindo a proxima corrida, calma calabreso
                throw new EstadoInvalidoException("Já existe uma corrida em andamento.");
            } //iniciar corrida já estando em uma

            
            //if (meioPadrao(processarPagamento(valorParaPagar)) && corrida.getStatus() == StatusCorridaEnum.EM_ANDAMENTO) {
            //    throw new PassageiroInvalidoException("Passageiro ja esta em uma corrida.");
            //} //passageiro tentar pagar a corrida antes de finalizar a corrida (menor ideia do que fazer aqui)

            boolean temPagamento = passageiro.getMeiosDePagamento() != null
                && passageiro.getMeiosDePagamento().getTamanho() > 0;

            if (!temPagamento) {
                throw new PassageiroInvalidoException("Cadastre pelo menos um meio de pagamento.");
            }
            // If all checks pass, return a successful Operacao
            return new Resposta(NOME_OPERACAO, true, "Passageiro ficou disponível com sucesso.");
        } catch (PassageiroInvalidoException e) {
            return new Resposta(NOME_OPERACAO, false, e.getMessage());
        } catch (PagamentoPendenteException e) {
            return new Resposta(NOME_OPERACAO, false, "Erro ao atualizar status do passageiro.");
        } catch (SaldoInsuficienteException e) {
            return new Resposta(NOME_OPERACAO, false, "Erro ao atualizar status do passageiro.");
        } catch (MetodoPagamentoInexistenteException e) {
            return new Resposta(NOME_OPERACAO, false, "Erro ao atualizar status do passageiro.");
        } catch (EstadoInvalidoException e) {
            return new Resposta(NOME_OPERACAO, false, "Erro ao atualizar status do passageiro.");
        }
    }

    public static Passageiro login(

        CredenciaisLogin credenciais,
        CadastroAutenticavel<Passageiro> cadastro

    ) throws UsuarioOuSenhaIncorretosException{

        Passageiro p = cadastro.buscarPorEmail(credenciais.getEmail());
        if (p == null) throw new UsuarioOuSenhaIncorretosException();

        boolean senhaValida = p.verificarSenha(credenciais.getSenha());
        if (!senhaValida) throw new UsuarioOuSenhaIncorretosException();

        return p;
    }
}
