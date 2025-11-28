package com.example.entidades;

public class Veiculo {
    String placa;
    String modelo;
    String cor;
    int ano;
    boolean documentacaoValida = true;

    public Veiculo(String placa, String modelo, String cor, int ano) {
        this.placa = placa;
        this.modelo = modelo;
        this.cor = cor;
        this.ano = ano;
    }

    // Getters e Setters
    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public int getAno() {
        return ano;
    }

    public void setAno(int ano) {
        this.ano = ano;
    }

    public boolean isDocumentacaoValida() {
        return documentacaoValida;
    }

    public void setDocumentacaoValida(boolean documentacaoValida) {
        this.documentacaoValida = documentacaoValida;
    }
}
