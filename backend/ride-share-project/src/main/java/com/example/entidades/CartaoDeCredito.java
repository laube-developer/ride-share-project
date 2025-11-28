package com.example.entidades;
import java.time.LocalDate;

public class CartaoDeCredito extends MeioDePagamento {
	
	private final String numero;
	private final String nomeTitular;
	private final LocalDate validade; 
	
	public CartaoDeCredito(String numero, String nomeTitular, LocalDate validade, int limite) {
		super("CartaoDeCredito", limite);
		
		this.numero = numero;
		this.nomeTitular = nomeTitular;
		this.validade = validade; 
	}
	
        @Override
	public boolean processarPagamento(int valorParaPagar){
		boolean processou=false;

		int limiteRestante = getSaldo();
		if( limiteRestante >= valorParaPagar) {
			limiteRestante = limiteRestante - valorParaPagar;
			processou = true;
		}
		else
			System.out.println("Limite insuficiente");
	
		if(processou){
			System.out.println("Pagamento processado com sucesso!");
		}else
			System.out.println("Erro ao processar pagamento!");

		setSaldo(limiteRestante);
		
		return processou;
	}
	
        @Override
	public void adicionarSaldo(int valor){
		super.setSaldo(valor);
		valor += getSaldo();
		setSaldo(valor);
		System.out.println("Valor adicionado com sucesso, seu novo limite restante: " + getSaldo() );
	}

	public LocalDate getValidade() {
		return validade;
	}

	public String getNumero() {
		return numero;
	}
	
	public String getNome() {
		return nomeTitular;
	}


}
