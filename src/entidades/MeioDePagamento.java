package entidades;

public class MeioDePagamento {
	
	private String nomeMeioPagamento;
	private int saldo;
	
	public MeioDePagamento(String nome){
		nomeMeioPagamento = nome;
	}
	
	public boolean processarPagamento(int valorParaPagar){
		boolean processou=false;
		
		if(nomeMeioPagamento == "PIX" || nomeMeioPagamento == "Dinheiro") {
			if(saldo >= valorParaPagar) {
				saldo = saldo - valorParaPagar;
				processou = true;
			}
			else
				System.out.println("Saldo em " + nomeMeioPagamento + " insuficiente");
	
		}
		else
			processou = true;

		
		if(processou){
			System.out.println("Pagamento por "+ nomeMeioPagamento +" processado com sucesso!");
		}else
			System.out.println("Erro ao processar pagamento!");

		return processou;
	}
	
	public void adicionarSaldo(int valor){
		saldo = saldo + valor;
		System.out.println("Valor adicionado com sucesso, seu novo saldo em" + nomeMeioPagamento + ": " + saldo);
	}	
	
	public int getSaldo(){
		return saldo;
	}
	
	public String toString() {
		return "asdas";
	}
	
}
