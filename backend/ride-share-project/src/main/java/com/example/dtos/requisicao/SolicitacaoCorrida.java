package com.example.dtos.requisicao;

import com.example.dtos.resposta.SessaoFrontend;
import com.example.entidades.GeoLocalizacao;
import com.example.enums.CategoriaCorridaEnum;

public class SolicitacaoCorrida {
    private SessaoFrontend sessao;
    private GeoLocalizacao origem;
    private GeoLocalizacao destino;
    private CategoriaCorridaEnum categoria;
    int precoEstimado;

    public SessaoFrontend getSessao(){
        return this.sessao;
    }

    public GeoLocalizacao getOrigem(){
        return this.origem;
    }

    public GeoLocalizacao getDestino(){
        return this.destino;
    }

    public CategoriaCorridaEnum getCategoria(){
        return this.categoria;
    }

    public int getPrecoEstimado(){
        return precoEstimado;
    }
}