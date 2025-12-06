package com.example.entidades;

//import com.example.entidades.Passageiro; mano o meu projeto ta mais amarelo que tudo mds
//import com.example.parametricos.Cadastro; nao sei, so acho que talvez funcione

public abstract class MeioDePagamento {
	
	private final String nomeMeioPagamento; // final pq na teoria ele nao deveria mudar, se o cartao muda o metodo vira outro, ele cadastra outro
	private int saldo;

	public MeioDePagamento(String nome, int saldo){
		nomeMeioPagamento = nome;
		this.saldo = saldo;
	}
	
	public abstract boolean processarPagamento(int valorParaPagar);
	
	public abstract void adicionarSaldo(int valor);
	
	public int getSaldo() {
		return saldo;
	}

	public void setSaldo(int saldo) {
		this.saldo = saldo;
	}

	public String getNomeMeioPagamento() {
		return nomeMeioPagamento;
	}

	/*public boolean setMeioPadrao(MeioDePagamento meioPadrao) {
		if (meioPadrao == null) {
			System.out.println("Meio de pagamento invalido.");
			return false;
		}

		//int index = MeioDePagamento(meioPadrao);
		//if (index < 0 || index >= this.meiosDePagamento.getTamanho()) {
		//	System.out.println("Meio de pagamento nao cadastrado.");
		//	return false;
		//}
		//Pelo amor de Deus alguem me ajuda


		this.meioPadrao = meioPadrao;
		System.out.println("Meio de pagamento padrao alterado com sucesso!");
		return true;
	}*/

}