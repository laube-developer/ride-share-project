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

    private static final String OPERACAO_SOLICITACAO = "solicitar-corrida";
    private static final String OPERACAO_CANCELAMENTO = "cancelar-corrida";
    private static final String OPERACAO_PAGAMENTO = "processar-pagamento";

    // Parte de meio de pagamento, não sei se ponho aqui tbm
    //private static final String OPERACAO_ADC_MEIO_PAG = "adicionar-meio-pagamento";
    //private static final String OPERACAO_RMV_MEIO_PAG = "remover-meio-pagamento";
    //private static final String OPERACAO_LIST_MEIO_PAG = "listar-meios-pagamento";

    public static Operacao solicitarCorrida(Corrida corrida, Passageiro passageiro) throws UsuarioouSenhaIncorretosException, EstadoInvalidoException {
        
        StatusCorridaEnum status = corrida.getStatus();

        try {
            if (passageiro == null || !passageiro.verificarSenha(passageiro.getSenha())) {
                throw new UsuarioouSenhaIncorretosException("Usuário ou senha incorretos.");           
            }
    

        //Isso daqui vem para o solicitar corrida
            //if (status == StatusCorridaEnum.EM_ANDAMENTO || status == StatusCorridaEnum.ACEITA) { //o cara ta pensanndo no futuro já, pedindo a proxima corrida, calma calabreso
            //    throw new EstadoInvalidoException("Já existe uma corrida em andamento.");
            //} //iniciar corrida já estando em uma

        return new Operacao(OPERACAO_SOLICITACAO, true, "...");
        
        } catch (UsuarioouSenhaIncorretosException e) {
            return new Operacao(OPERACAO_SOLICITACAO, false, e.getMessage());
        }
    }

    public static Operacao cancelarCorrida(...) {

        try {
            // Lógica para cancelar a corrida
        return new Operacao(OPERACAO_CANCELAMENTO, true, "...");

        } catch (Exception e) {
            return new Operacao(OPERACAO_CANCELAMENTO, false, e.getMessage());
        }
    }

    public static Operacao processarPagamento(MeioDePagamento meioPadrao, Corrida corrida, Passageiro passageiro, int valorParaPagar, int saldo) throws SaldoInsuficienteException, PagamentoPendenteException, UsuarioouSenhaIncorretosException, EstadoInvalidoException, MetodoPagamentoInexistenteException {   
        
        StatusCorridaEnum status = corrida.getStatus();

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
        return new Operacao(OPERACAO_PAGAMENTO, true, "Pagamento processado com sucesso");

        } catch (UsuarioouSenhaIncorretosException e) {
            return new Operacao(OPERACAO_PAGAMENTO, false, e.getMessage());
        } catch (PagamentoPendenteException e) {
            return new Operacao(OPERACAO_PAGAMENTO, false, e.getMessage());
        } catch (SaldoInsuficienteException e) {
            return new Operacao(OPERACAO_PAGAMENTO, false, e.getMessage());
        } catch (MetodoPagamentoInexistenteException e) {
            return new Operacao(OPERACAO_PAGAMENTO, false, e.getMessage());
        } catch (EstadoInvalidoException e) {
            return new Operacao(OPERACAO_PAGAMENTO, false, e.getMessage());
        }
    }
}
