package com.example.entidades;

import com.example.interfaces.Sessionavel;
import com.example.parametricos.Cadastro;

public class CadastroSessionavel<T extends Sessionavel> extends Cadastro<T> {
    public CadastroSessionavel(int tamanho){
        super(tamanho);
    }

    private String email;
    private String token;

    public String getEmail(){return this.email;}
    public String getToken(){return this.token;}
    
    public void setEmail(String email){this.email = email;}
    public void setToken(String token){this.token = token;}

    public T getSessao(String token, String email){
		for (T item : this.lista) {
			if (item.verificarToken(token) && item.verificarEmail(email)) return item;
		}

		System.out.println("Objeto não encontrado.");
		return null;
	}

    public boolean temSessaoAtiva(String email){
        for (T item : this.lista){
            if (item.verificarEmail(email)) return true;
        }

        return false;
    }

    public T getSessao(String email){
        for (T item : lista){
            if (item.verificarEmail(email)) return item;
        }

        System.out.println("Sessao não encontrada");
        return null;
    }
}
