package com.example.exceptions;

public class MetodoDePagamentoDuplicadoException extends Exception {
    public MetodoDePagamentoDuplicadoException(String mensagem) {
        super(mensagem);
    }
    
    public MetodoDePagamentoDuplicadoException() {
        super("Método de pagamento já cadastrado para este usuário.");
    }   
}
