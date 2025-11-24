package com.example.exceptions;

// Motorista com CNH ou Documento do carro jah vencido ou inválido
public class MotoristaInvalidoException extends Exception {
        public MotoristaInvalidoException(String message) {
        super(message);
    }    
        public MotoristaInvalidoException() {
        super("Documento Inválido.");
    }   
}
