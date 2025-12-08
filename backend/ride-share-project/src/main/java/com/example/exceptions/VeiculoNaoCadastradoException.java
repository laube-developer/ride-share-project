package com.example.exceptions;

public class VeiculoNaoCadastradoException extends Exception {
    public VeiculoNaoCadastradoException(String message) {
        super(message);
    }    
    public VeiculoNaoCadastradoException() {
        super("Veículo não cadastrado.");
    }
}