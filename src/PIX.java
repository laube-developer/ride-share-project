
public class PIX extends MeioDePagamento{
	private String chave;

	public PIX(String chave, int saldo) {
		super("PIX", saldo);
		
		this.chave = chave;
	}
	
	public boolean processarPagamento(int valorParaPagar) {
		System.out.println("Pagamento processado com sucesso!");
		
		return true;
	}

	public String getChave() {
		return chave;
	}
	
	public void adicionarSaldo(int valor) {
		setSaldo(valor);
		System.out.println("Valor adicionado com sucesso, sua nova quantidade de Dinheiro : " + getSaldo() );
	}
	
	
}
