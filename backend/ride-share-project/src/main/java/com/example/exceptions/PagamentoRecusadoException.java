package com.example.exceptions;

//Excecao para recusas no pagamento com cartao ou pix.

public class PagamentoRecusadoException extends Exception {
        public PagamentoRecusadoException(String message) {
        super(message);
    }    
        public PagamentoRecusadoException() {
        super("Pagamento recusado, tente novamente ou escolha outra forma de pagamento.");
    }   
}
