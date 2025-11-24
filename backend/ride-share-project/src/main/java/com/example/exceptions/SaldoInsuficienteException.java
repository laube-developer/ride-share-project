package com.example.exceptions;

//Essa excecao acontecera apenas para pagamentos com saldo do aplicativo, para outros casos, o banco ira informar o saldo.

public class SaldoInsuficienteException extends Exception{
        public SaldoInsuficienteException(String message) {
        super(message);
    }    
        public SaldoInsuficienteException() {
        super("Saldo Insuficiente, escolha outra forma de pagamento.");
    }       
}
