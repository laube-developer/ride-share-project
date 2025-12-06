package com.example.dtos;

public class SessaoFrontend {
    private String nomeDeUsuario;
    private String sessaoToken;
    private String email;
    private String categoria;

    public SessaoFrontend(
        String nomeDeUsuario,
        String sessaoToken,
        String email,
        String categoria
    ){
        this.nomeDeUsuario = nomeDeUsuario;
        this.sessaoToken = sessaoToken;
        this.email = email;
        this.categoria = categoria;
    }

    public String getNomeDeUsuario(){
        return nomeDeUsuario;
    }

    public void setNomeDeUsuario(String nomeDeUsuario){
        this.nomeDeUsuario = nomeDeUsuario;
    }

    public String getSessaoToken(){
        return sessaoToken;
    }

    public void setSessaoToken(String sessaoToken){
        this.sessaoToken = sessaoToken;
    }

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public String getCatetoria(){
        return categoria;
    }

    public void setCategoria(String c){
        this.categoria = c;
    }

}