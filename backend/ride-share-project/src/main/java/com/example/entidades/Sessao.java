package com.example.entidades;

import com.example.interfaces.Sessionavel;

public class Sessao implements Sessionavel{
    private String token;
    private String userEmail;

    public void setUserEmail(String email){
        userEmail = email;
    }

    public String getUserEmail(){
        return userEmail;
    }

    public boolean verificarEmail(String email){
        return this.userEmail.equals(email);
    }

    public boolean verificarToken(String token){
        return this.token.equals(token);
    }

    public boolean verificarSessao(String token, String email){
        return token.equals(this.token) && email.equals(this.userEmail);
    }
}
