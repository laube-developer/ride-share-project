package com.example.exceptions;

public class UsuarioOuSenhaIncorretosException extends Exception {
        public UsuarioOuSenhaIncorretosException(String message) {
        super(message);
    }    
        public UsuarioOuSenhaIncorretosException() {
        super("Usuário ou Senha incorretos, tente novamente.");
    }   
}
