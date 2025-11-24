package com.example.exceptions;

public class NenhumMotoristaEncontradoException  extends Exception {
        public NenhumMotoristaEncontradoException (String message) {
        super(message);
    }    
        public NenhumMotoristaEncontradoException () {
        super("Nenhum motorista está disponível no momento.");
    }       
}
