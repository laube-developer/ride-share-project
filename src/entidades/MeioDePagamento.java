package entidades;

public abstract class MeioDePagamento {
	
	private String nomeMeioPagamento;
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
	
	//public abstract String toString();

	public String getNomeMeioPagamento() {
		return nomeMeioPagamento;
	}

}