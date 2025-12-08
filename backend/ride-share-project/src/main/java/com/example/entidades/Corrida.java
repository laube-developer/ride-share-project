package com.example.entidades;

import com.example.enums.CategoriaCorridaEnum;
import com.example.enums.StatusCorridaEnum;
import com.example.exceptions.EstadoInvalidoException;

public class Corrida {
	private GeoLocalizacao localPartida;
	private GeoLocalizacao localDestino;
	private int precoEstimado;
	private CategoriaCorridaEnum categoria;
	private StatusCorridaEnum status;
	private Motorista motorista;
	private Passageiro passageiro;
	
	public Corrida(
			GeoLocalizacao localPartida,
			GeoLocalizacao localDestino,
			int precoEstimado, //em centavos
			CategoriaCorridaEnum categoria,
			StatusCorridaEnum status,
			Motorista motorista,
			Passageiro passageiro
	) {
		this.localPartida = localPartida;
		this.localDestino = localDestino;
		this.precoEstimado = precoEstimado;
		this.categoria = categoria;
		this.status = status;
		this.motorista = motorista;
		this.passageiro = passageiro;
	}
	
	public Passageiro getPassageiro() {
		return passageiro;
	}
	
	public Motorista getMotorista(){
		return motorista;
	}
	
	public void setMotorista(Motorista motorista) {
		this.motorista = motorista;
	}
	
	public void setStatus(StatusCorridaEnum status) {
		this.status = status;
	}
	
	public GeoLocalizacao getPartida() {
		return localPartida;
	}
	
	public GeoLocalizacao getDestino() {
		return localDestino;
	}
	
	public int getPrecoEstimado() {
		return precoEstimado;
	}
	
	public CategoriaCorridaEnum getCategoria() {
		return categoria;
	}
	
	public StatusCorridaEnum getStatus() {
		return status;
	}
	
	public boolean iniciarViagem() {
		// Só pode iniciar se foi aceita por um motorista
		if (status != StatusCorridaEnum.ACEITA) {
			System.out.println("Viagem não pode ser iniciada neste estado.");
			return false;
		}
		this.status = StatusCorridaEnum.EM_ANDAMENTO;
		return true;
	}
	
	public boolean finalizarViagem() throws EstadoInvalidoException {
		// Só pode finalizar se está em andamento
		if (status != StatusCorridaEnum.EM_ANDAMENTO) {
			
			throw new EstadoInvalidoException("Viagem não pode ser finalizada neste estado.");
			return false;
		}
		this.status = StatusCorridaEnum.CONCLUIDA;
		return true;
	}
	
	public boolean cancelar() {
		// Cancelar apenas se status for igual a SOLICITADA ou ACEITA
		boolean podeCancel = (
				   !status.equals(StatusCorridaEnum.CANCELADA)
				&& !status.equals(StatusCorridaEnum.EM_ANDAMENTO)
				&& !status.equals(StatusCorridaEnum.CONCLUIDA)
		);
		
		if (!podeCancel) {
			return false;
		}
		
		this.status = StatusCorridaEnum.CANCELADA;		
		return true;
	}
	
	
}
