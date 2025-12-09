package com.example.dtos.requisicao;

import com.example.dtos.resposta.SessaoFrontend;
import com.example.entidades.CNH;

public class UpdateCNH {
    private SessaoFrontend sessao;
    private CNH cnh;

    UpdateCNH(SessaoFrontend sessao, CNH cnh){
        this.sessao = sessao;
        this.cnh = cnh;
    }

    public SessaoFrontend getSessao(){
        return this.sessao;
    }

    public CNH getCnh(){
        return this.cnh;
    }

    public void setCnh(CNH cnh){
        this.cnh = cnh;
    }

    public void setSessao(SessaoFrontend sessao){
        this.sessao = sessao;
    }
}
