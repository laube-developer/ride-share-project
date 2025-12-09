package com.example.entidades;

import com.example.interfaces.Sessionavel;

public class Sessao implements Sessionavel{
    private String token;
    private Usuario usuario;

    public void setUsuario(Usuario usuario){
        this.usuario = usuario;
    }

    public Usuario getUsuario(){
        return usuario;
    }

    public void setTokenSessao(String token){
        this.token = token;
    }

    public boolean verificarEmail(String email){
        return this.usuario.getEmail().equals(email);
    }

    public boolean verificarToken(String token){
        if (this.token == null) return false;
        return this.token.equals(token);
    }

    public boolean verificarSessao(String token, String email){
        return token.equals(this.token) && email.equals(this.usuario.getEmail());
    }
}
