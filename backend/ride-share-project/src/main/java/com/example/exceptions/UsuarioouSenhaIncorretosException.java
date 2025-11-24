package com.example.exceptions;

public class UsuarioouSenhaIncorretosException extends Exception {
        public UsuarioouSenhaIncorretosException(String message) {
        super(message);
    }    
        public UsuarioouSenhaIncorretosException() {
        super("Usuário ou Senha incorreto, tente novamente.");
    }   
}
