package com.example.examples;

public class Operacao {
    private String nome;
    private boolean status = true;
    private String mensagem = "Operacao realizada com sucesso.";

    public Operacao(String nome, boolean status, String mensagem) {
        this.nome = nome;
        this.status = status;
        this.mensagem = mensagem;
    }

    public Operacao(String nome) {
        this.nome = nome;
    }

    public String json() {
        return String.format(
            "{ \"nome\": \"%s\", \"status\": %s, \"mensagem\": \"%s\" }",
            nome,
            status,
            mensagem
        );
    }

    public Operacao setNome(String nome) {
        this.nome = nome;
        return this;
    }

    public Operacao setStatus(boolean status) {
        this.status = status;
        return this;
    }

    public Operacao setMensagem(String mensagem) {
        this.mensagem = mensagem;
        return this;
    }

    public String getNome() {
        return nome;
    }

    public boolean getStatus() {
        return status;
    }

    public String getMensagem() {
        return mensagem;
    }

}
