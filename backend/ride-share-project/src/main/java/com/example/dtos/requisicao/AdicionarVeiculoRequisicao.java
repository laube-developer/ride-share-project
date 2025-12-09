package com.example.dtos.requisicao;

import com.example.dtos.resposta.SessaoFrontend;
import com.example.entidades.Veiculo;

public class AdicionarVeiculoRequisicao {
    private SessaoFrontend sessao;
    private Veiculo veiculo;

    public SessaoFrontend getSessao() {
        return sessao;
    }

    public void setSessao(SessaoFrontend sessao) {
        this.sessao = sessao;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }
}
