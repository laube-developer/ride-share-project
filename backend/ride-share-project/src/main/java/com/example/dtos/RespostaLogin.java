package com.example.dtos;

import com.example.enums.CategoriaUsuarioEnum;

public class RespostaLogin {
    private String nomeDeUsuario;
    private String sessaoToken;
    private String email;
    private CategoriaUsuarioEnum categoria;

    public RespostaLogin(
        String nomeDeUsuario,
        String sessaoToken,
        String email,
        CategoriaUsuarioEnum categoria
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

    public CategoriaUsuarioEnum getCatetoria(){
        return categoria;
    }

    public void setCategoria(CategoriaUsuarioEnum c){
        this.categoria = c;
    }

}