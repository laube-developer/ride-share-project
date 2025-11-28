package com.example.exceptions;

public class PassageiroInvalidoException extends Exception {
        public PassageiroInvalidoException(String message) {
        super(message);
    }    
        public PassageiroInvalidoException() {
        super("Erro - Ação não permitida.");
    }
}