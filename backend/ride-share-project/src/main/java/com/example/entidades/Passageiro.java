package com.example.entidades;

import java.util.ArrayList;
import com.example.parametricos.Cadastro;

public class Passageiro extends Usuario{
	
	private Cadastro<MeioDePagamento> meioDePagamento;
	
	public Passageiro(String nome, String email, String senha, String cpf, String telefone){
		super(nome, email, senha, cpf, telefone);
		
		this.nome = nome;
		this.email = email;
		this.senha = senha;
		this.cpf = cpf;
		this.telefone = telefone;
		
		meioDePagamento = new Cadastro<MeioDePagamento>(5); //limite do usuario 5 meios
	}
	
	public Cadastro<MeioDePagamento> getMeiosDePagamento(){
		return meioDePagamento;
	}
	
	public void cadastrarMeioDePagamento(MeioDePagamento meioDePagamentoAdicionar) {
		if (meioDePagamento.getTamanho() == 5) {
			System.out.println("Remova um meio de pagamento para adicionar outro. 5 meios já cadastrado!");
			
			return;
		}
		meioDePagamento.adicionar(meioDePagamentoAdicionar);
	}
	
	public void removerMeioDePagamento(MeioDePagamento meioDePagamentoRemover) {
		int index = meioDePagamento.indexOf(meioDePagamentoRemover);
		meioDePagamento.remover(index);
		
		System.out.println("Meio de pagamento cadastrado com sucesso!");
	}
	
}