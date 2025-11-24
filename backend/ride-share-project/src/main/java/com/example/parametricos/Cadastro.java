package com.example.parametricos;

public class Cadastro <T> {
	
	private Object[] lista;
	private int tamanhoMax;
	private int tamanho = 0;
	
	public Cadastro(int tamanho){
		lista = new Object[tamanho];
			
		this.tamanhoMax = tamanho;
	}

	public Object[] getList(){
		return lista;
	}
	
	public boolean adicionar(T t) {
		if(tamanho >= tamanhoMax) {
			System.out.println("Quantidade máxima atingida!");
			return false;
		}
		
		lista[tamanho] = t;
		tamanho ++;
		
		return true;
	}
	
	
	public void remover(Object x) {
		boolean jaEncontrou = false;
		
		for(int i =0; i < lista.length - 1; i++) {
			jaEncontrou |= lista[i] == x;
			
			if (jaEncontrou) {
				lista[i] = lista[i+1];
			}
			
		}
		
		if (jaEncontrou) {
			lista[tamanho] = null;
			tamanho--;
			return;
		}

		
		System.out.println("O objeto a ser removido não foi encontrado!");
		
	}
	
	public int getTamanho() {
        return tamanho;
    }

	public Object buscarPorId(int id) {
		if (id >= tamanhoMax || id < 0) {
			System.out.println("Índice inválido");
			return null;
		}
		
		return lista[id];
	}
	
	public int indexOf(Object x) {
		for (int i = 0; i < tamanho; i++) {
			if (lista[i] == x) return i;
		}
		
		System.out.println("Objeto não encontrado.");
		return -1;
	}
	
	public Object first() {
		return lista[0];
	}
	
}
