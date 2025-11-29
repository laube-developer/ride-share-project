package com.example.entidades;

public class Dinheiro extends MeioDePagamento{
	
        @SuppressWarnings("unused")
	Dinheiro(int saldo){
		super("Dinheiro", saldo);
	}

        @Override
	public boolean processarPagamento(int valorParaPagar) {
		boolean processou=false;

		int saldoDinheiro = getSaldo();
		if( saldoDinheiro >= valorParaPagar) {
			saldoDinheiro = saldoDinheiro - valorParaPagar;
			processou = true;
		}
		else
			System.out.println("Saldo em dinheiro insuficiente");
	
		if(processou){
			System.out.println("Pagamento processado com sucesso!");
		}else
			System.out.println("Erro ao processar pagamento!");

		setSaldo(saldoDinheiro);
		
		return processou;
	}

        @Override
	public void adicionarSaldo(int valor) {
		setSaldo(valor);
		System.out.println("Valor adicionado com sucesso, sua nova quantidade de Dinheiro : " + getSaldo() );
	}
}