package entidades;

public class Passageiro extends Usuario{

	
	private MeioDePagamento[] meioDePagamento;
	
	Passageiro(String nome, String email, String senha, String cpf, String telefone){
		super(nome, email, senha, cpf, telefone);
		
		this.nome = nome;
		this.email = email;
		this.senha = senha;
		this.cpf = cpf;
		this.telefone = telefone;
	}
	
	public MeioDePagamento[] getMeiosDePagamento(){
		return meioDePagamento;
	}
	
	public void cadastrarMeioDePagamento(MeioDePagamento meioDePagamento) {
		//logica
	}
	
	public void removerMeioDePagamento(MeioDePagamento meioDePagamento) {
		//logica
	}
	
}