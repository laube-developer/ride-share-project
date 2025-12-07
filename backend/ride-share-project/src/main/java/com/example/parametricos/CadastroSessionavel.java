package com.example.parametricos;

import com.example.interfaces.Sessionavel;

public class CadastroSessionavel<T extends Sessionavel> extends Cadastro<T> {
    public CadastroSessionavel(int tamanho){
        super(tamanho);
    }

    public T getSessao(String token, String email){
		for (T item : this.lista) {
			if (item.verificarToken(token) && item.verificarEmail(email)) return item;
		}

		System.out.println("Objeto não encontrado.");
		return null;
	}

    public boolean removerSessoesAbertas(String email){
        boolean removeuAlgum = false;

        for (T item : lista) {
            if (item.verificarEmail(email)) {
                removeuAlgum |= super.remover(item);
            }
        }

        return removeuAlgum;
    }

    public boolean removerSessao(String token, String email){
        for (T item : lista) {
            if (item.verificarEmail(email) && item.verificarToken(token)) {
                super.remover(item);
                return true;
            }
        }

        return false;
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

    public T buscarPorToken(String token){
        for (T item : lista){
            if (item.verificarToken(token)) return item;
        }

        System.out.println("Sessao não encontrada");
        return null;
    }
}
