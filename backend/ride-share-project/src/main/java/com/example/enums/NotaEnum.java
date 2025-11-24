package com.example.enums;

public enum NotaEnum {
	NOTA_1(1),
	NOTA_2(2),
	NOTA_3(3),
	NOTA_4(4),
	NOTA_5(5);
	
	private final int valor;
	
	NotaEnum(int valor){
		this.valor = valor;
	}
	
	public int getValor() {
		return this.valor;
	}
}