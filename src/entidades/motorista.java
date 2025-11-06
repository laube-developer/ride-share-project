package entidades;

import java.util.List;

import enums.StatusMotoristaEnum;

public class Motorista extends Usuario {
    Veiculo veiculoAtivo;
    List<Veiculo> veiculos;
    CNH cnh;
    StatusMotoristaEnum status;
    
    public Motorista(
    		String nome,
    		String email,
    		String senha,
    		String cpf,
    		String telefone
    	) {
        super(nome, email, senha, cpf, telefone);
        
    }

    // Getters e Setters
    public CNH getCNH() {
        return cnh;
    }

    public void setCNH(CNH cnh) {
        this.cnh = cnh;
    }

    public List<Veiculo> getVeiculos() {
        return veiculos;
    }

    public Veiculo getVeiculoAtivo() {
        return veiculoAtivo;
        // Lógica para retornar o veículo ativo
    }
    
    public boolean setVeiculoAtivo(Veiculo veiculo) {
    		if (!veiculos.contains(veiculo)) {
    			veiculos.add(veiculo);
    		}
    		
    		veiculoAtivo = veiculo;
    		return true;
    }

    public void trocarVeiculo(Veiculo veiculo) {
        veiculos.add(veiculo);
    }

    public void removerVeiculo(Veiculo v) {
        if (veiculos.contains(v)) {
        		veiculos.remove(v);
        }
    }

    public StatusMotoristaEnum getStatus() {
        return status;
    }
}
