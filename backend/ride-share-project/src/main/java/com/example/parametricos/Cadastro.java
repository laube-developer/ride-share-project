package com.example.parametricos;

import java.util.ArrayList;
import java.util.List;

public class Cadastro <T> {
	
	protected List<T> lista;
	protected final int tamanhoMax;
	protected int tamanho = 0;
	
	public Cadastro(int tamanho){
		this.tamanhoMax = tamanho;
		lista = new ArrayList<>(tamanho);
	}

	public List<T> getList(){
		return lista;
	}
	
	public boolean adicionar(T t) {
		if(tamanho >= tamanhoMax) {
			System.out.println("Quantidade máxima atingida!");
			return false;
		}
		
		lista.add(t);
		
		return true;
	}
	
	
	public boolean remover(Object x) {
		return lista.remove(x);
	}
	
	public int getTamanho() {
        return tamanho;
    }

	public T buscarPorId(int id) {
		
		if (id >= tamanhoMax || id < 0) {
			System.out.println("Índice inválido");
			return null;
		}

		return lista.get(id);
	}
	
	public int indexOf(T x) {
		return lista.indexOf(x);
	}
}
