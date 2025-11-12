package entidades;

import enums.CategoriaCorridaEnum;
import enums.StatusCorridaEnum;

public class Corrida {
	private GeoLocalizacao localPartida;
	private GeoLocalizacao localDestino;
	private int precoEstimado;
	private CategoriaCorridaEnum categoria;
	private StatusCorridaEnum status;
	private Motorista motorista;
	private Passageiro passageiro;
	
	Corrida(
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
	
	public boolean solicitarViagem() {
		//Implementar solicitacao da viagem
		return true;
	}
	
	public boolean iniciarViagem() {
		//Implementar a soliciatacao da viagem
		return true;
	}
	
	public boolean finalizarViagem() {
		//mplementar a solicitacao da viagem
		return true;
	}
	
	public boolean cancelar() {
		//Cancelar apenas se status for diferente de ACEITA e SOLICITADA
		boolean condition = (
				!status.equals(StatusCorridaEnum.ACEITA) 
				&& !status.equals(StatusCorridaEnum.CANCELADA) 
				);
		
		if (condition) {
			System.out.println("Não é possível cancelar.");
			return false;
		}
		
		//Processar o cancelamento da corrida

		status = StatusCorridaEnum.CANCELADA;		
		return true;
		
		
	}
	
	
}
