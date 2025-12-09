package com.example.parametricos;

import com.example.interfaces.Autenticavel;

public class CadastroAutenticavel<T extends Autenticavel> extends Cadastro<T> {
    public CadastroAutenticavel(int tamanho){
        super(tamanho);
    }

    private String email;
    public void setEmail(String email){this.email = email;}
    public String getEmail(){return this.email;}

    public T buscarPorEmail(String email){
		for (T item : this.lista) {
			if (item.getEmail().equals(email)) return item;
		}

		System.out.println("Autenticavel: Objeto não encontrado.");
		return null;
	}
}
