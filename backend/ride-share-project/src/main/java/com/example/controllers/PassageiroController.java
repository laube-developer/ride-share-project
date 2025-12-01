package com.example.controllers;

import com.example.entidades.Passageiro;
import com.example.enums.StatusCorridaEnum;
import com.example.exceptions.EstadoInvalidoException;
import com.example.examples.Resposta;
import com.example.exceptions.UsuarioOuSenhaIncorretosException;
import com.example.exceptions.SaldoInsuficienteException;
import com.example.parametricos.Cadastro;
import com.example.exceptions.PagamentoPendenteException;
import com.example.entidades.CadastroAutenticavel;
import com.example.entidades.Corrida;
import com.example.entidades.CredenciaisLogin;
import com.example.exceptions.MetodoPagamentoInexistenteException;
import com.example.entidades.MeioDePagamento;
import com.example.enums.OperacaoPassageiro;

import ch.qos.logback.core.status.Status;

public class PassageiroController {

    public static Resposta solicitarCorrida(Corrida corrida, Passageiro passageiro) throws UsuarioOuSenhaIncorretosException, EstadoInvalidoException {
        
        StatusCorridaEnum status = corrida.getStatus();

        try {
            if (passageiro == null || !passageiro.verificarSenha(passageiro.getSenha())) {

        //Isso daqui vem para o solicitar corrida
            //if (status == StatusCorridaEnum.EM_ANDAMENTO || status == StatusCorridaEnum.ACEITA) { //o cara ta pensanndo no futuro já, pedindo a proxima corrida, calma calabreso
            //    throw new EstadoInvalidoException("Já existe uma corrida em andamento.");
            //} //iniciar corrida já estando em uma

        return new Resposta(OperacaoPassageiro.SOLICITACAO.getNome(), true, "...");
        
        } catch (UsuarioOuSenhaIncorretosException e) {
            return new Resposta(OperacaoPassageiro.SOLICITACAO.getNome(), false, e.getMessage());
        }
    }

    public static Resposta cancelarCorrida(...) {

        try {
            // Lógica para cancelar a corrida
        return new Resposta(OperacaoPassageiro.CANCELAR.getNome(), true, "...");

        } catch (Exception e) {
            return new Resposta(OperacaoPassageiro.CANCELAR.getNome(), false, e.getMessage());
        }
    }

    public static Resposta processarPagamento(MeioDePagamento meioPadrao, Corrida corrida, Passageiro passageiro, int valorParaPagar, int saldo) throws SaldoInsuficienteException, PagamentoPendenteException, UsuarioOuSenhaIncorretosException, EstadoInvalidoException, MetodoPagamentoInexistenteException {   
        
        StatusCorridaEnum status = corrida.getStatus();

        try {
            if (passageiro == null || !passageiro.verificarSenha(passageiro.getSenha())) {
                throw new UsuarioOuSenhaIncorretosException("Usuário ou senha incorretos.");           
            }
            if (saldo < 0){ //saldo negativo, ele ta devendo
                throw new PagamentoPendenteException("Usuário realize o pagamento de suas pendências.");
            }
            if (saldo < valorParaPagar) { //tem mais dinheiro do que de quem deve, mas não tem dinheiro igual
                throw new SaldoInsuficienteException("Saldo Insuficiente, escolha outra forma de pagamento.");
            }
            if (meioPadrao == null) { // o cara acha q vamos pagar a corrida dele assim na alta po, ta achando que é facil
                throw new MetodoPagamentoInexistenteException("Cadastre pelo menos um meio de pagamento.");
            }
            if (status == StatusCorridaEnum.EM_ANDAMENTO) { //o cara ta tentando pagar a corrida antes de finalizar a corrida
                throw new EstadoInvalidoException("Não é possível pagar uma corrida que ainda não foi finalizada.");
            }

            boolean temPagamento = passageiro.getMeiosDePagamento() != null
                && passageiro.getMeiosDePagamento().getTamanho() > 0;

            if (!temPagamento) {
                throw new MetodoPagamentoInexistenteException("Cadastre pelo menos um meio de pagamento.");
            }
        // Se deu bom retorna a operação com sucesso.
        return new Resposta(OperacaoPassageiro.PAGAMENTO.getNome(), true, "Pagamento processado com sucesso");

        } catch (UsuarioOuSenhaIncorretosException e) {
            return new Resposta(OperacaoPassageiro.PAGAMENTO.getNome(), false, e.getMessage());
        } catch (PagamentoPendenteException e) {
            return new Resposta(OperacaoPassageiro.PAGAMENTO.getNome(), false, e.getMessage());
        } catch (SaldoInsuficienteException e) {
            return new Resposta(OperacaoPassageiro.PAGAMENTO.getNome(), false, e.getMessage());
        } catch (MetodoPagamentoInexistenteException e) {
            return new Resposta(OperacaoPassageiro.PAGAMENTO.getNome(), false, e.getMessage());
        } catch (EstadoInvalidoException e) {
            return new Resposta(OperacaoPassageiro.PAGAMENTO.getNome(), false, e.getMessage());
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
