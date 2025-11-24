package com.example.exceptions;

// Passageiro nao pagou a ultima corrida 
public class PagamentoPendenteException extends Exception {
    public PagamentoPendenteException(String message) {
        super(message);
    }    
        public PagamentoPendenteException() {
        super("Usuário realize o pagamento de suas pendências.");
    }    
}
