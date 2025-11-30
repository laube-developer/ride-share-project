package com.example.examples;

/**
 * Classe para gerenciar a reposta do backend para o frontend
 */
public class Resposta {
    private String operacao;
    private boolean status = true;
    private String mensagem = "";


    public Resposta(String operacao, boolean status, String mensagem) {
        this.operacao = operacao;
        this.status = status;
        this.mensagem = mensagem;
    }

    public Resposta(String operacao) {
        this.operacao = operacao;
    }

    public String json() {
        return String.format(
            "{ \"nome\": \"%s\", \"status\": %s, \"mensagem\": \"%s\" }",
            operacao,
            status,
            mensagem
        );
    }

    public Resposta setNome(String operacao) {
        this.operacao = operacao;
        return this;
    }

    public Resposta setStatus(boolean status) {
        this.status = status;
        return this;
    }

    public Resposta setMensagem(String mensagem) {
        this.mensagem = mensagem;
        return this;
    }

    public String getOperacao() {
        return operacao;
    }

    public boolean getStatus() {
        return status;
    }

    public String getMensagem() {
        return mensagem;
    }

}
