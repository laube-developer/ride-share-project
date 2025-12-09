package com.example.dtos.resposta;

import com.example.entidades.Veiculo;
import com.example.enums.OperacaoEnum;

public class RespostaVeiculo  extends Resposta{
    private Veiculo veiculo;

    public RespostaVeiculo(
        Veiculo veiculo,
        boolean status,
        String mensagem
    ){
        super(OperacaoEnum.MOTORISTA_BUSCAR_VEICULO_ATIVO, status, mensagem);

        this.veiculo = veiculo;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }
    
}
