package com.example.exceptions;

// Metodo de pagamento não existe, ou não foi cadastrado pelo passageiro
public class MetodoPagamentoInexistenteException extends Exception {
        public MetodoPagamentoInexistenteException(String message) {
        super(message);
    }    
        public MetodoPagamentoInexistenteException() {
        super("Método de pagamento não existe ou não foi cadastrado pelo passageiro.");
    }   
}
