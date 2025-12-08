package com.example.entidades;

import com.example.interfaces.Autenticavel;
import com.example.parametricos.Cadastro;

public class Passageiro extends Usuario implements Autenticavel{
	
	private Cadastro<MeioDePagamento> meioDePagamento;
	private MeioDePagamento meioPadrao;
	private int saldo; // em centavos; negativo = débito pendente
	
	public Passageiro(String nome, String email, String senha, String cpf, String telefone){
		super(nome, email, senha, cpf, telefone);
		
		this.nome = nome;
		this.email = email;
		this.senha = senha;
		this.cpf = cpf;
		this.telefone = telefone;
		
		this.saldo = 0; // Inicia com saldo zerado
		meioDePagamento = new Cadastro<MeioDePagamento>(5); //limite do usuario 5 meios
	}
	
	public Cadastro<MeioDePagamento> getMeiosDePagamento(){
		return meioDePagamento;
	}
	
	public MeioDePagamento getMeioPadrao() {
		return meioPadrao;
	}
	
	public boolean setMeioPadrao(MeioDePagamento meioPadrão) {
		if (meioPadrão == null) {
			return false;
		}
		
		// Verificar se o meio existe na lista
		int index = meioDePagamento.indexOf(meioPadrão);
		if (index < 0) {
			return false;
		}
		
		this.meioPadrao = meioPadrão;
		return true;
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
		if (index >= 0) {
			meioDePagamento.remover(index);
			System.out.println("Meio de pagamento removido com sucesso!");
			
			// Se era o padrão, limpar a referência
			if (meioPadrao != null && meioPadrao.equals(meioDePagamentoRemover)) {
				meioPadrao = null;
			}
		}
	}
	
	public int getSaldo() {
		return saldo;
	}
	
	public void setSaldo(int saldo) {
		this.saldo = saldo;
	}
	
	public void adicionarDebitoPendente(int valor) {
		this.saldo -= valor; // Diminui o saldo (fica negativo)
	}
	
	public void quitarDebito(int valor) {
		this.saldo += valor; // Aumenta o saldo (aproxima de zero)
	}
}