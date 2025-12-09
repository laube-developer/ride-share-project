package com.example.dtos.resposta;

import com.example.enums.OperacaoEnum;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Resposta {
    
    private boolean status = true;
    private String mensagem = "";
    private OperacaoEnum operacao;

    public Resposta(OperacaoEnum operacao, boolean status, String mensagem) {
        this.operacao = operacao;
        this.status = status;
        this.mensagem = mensagem;
    }

    public Resposta(OperacaoEnum operacao) {
        this.operacao = operacao;
    }
    
    public Resposta(OperacaoEnum operacao, String mensagemErro) {
        this.operacao = operacao;
        this.status = false;
        this.mensagem = mensagemErro;
    }
    
    
    public OperacaoEnum getOperacao() {
        return operacao;
    }
    
    public boolean getStatus() {
        return status;
    }
    
    public String getMensagem() {
        return mensagem;
    }
    
    public Resposta setOperacao(OperacaoEnum operacao) {
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

}