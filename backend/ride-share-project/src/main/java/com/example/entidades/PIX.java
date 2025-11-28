package com.example.entidades;



public class PIX extends MeioDePagamento{
	private String chave;

	public PIX(String chave, int saldo) {
		super("PIX", saldo);
		
		this.chave = chave;
	}
	
        @Override
	public boolean processarPagamento(int valorParaPagar) {
		System.out.println("Pagamento processado com sucesso!");
		
		return true;
	}

	public String getChave() {
		return chave;
	}
	
        @Override
	public void adicionarSaldo(int valor) {
		setSaldo(getSaldo() + valor);
		System.out.println("Valor adicionado com sucesso, sua nova quantidade de Dinheiro : " + getSaldo() );
	}

    public void setChave(String chave) {
        this.chave = chave;
    }
	
	
}
