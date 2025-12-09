package com.example.dtos.resposta;

import com.example.enums.OperacaoEnum;

public class RespostaLogin extends Resposta{
    private SessaoFrontend sessao;

    public RespostaLogin(
        SessaoFrontend sessao,
        boolean status,
        String mensagem
    ){
        super(
            (sessao.getCategoria().equals("PASSAGEIRO")
            ? OperacaoEnum.PASSAGEIRO_LOGIN
            : OperacaoEnum.MOTORISTA_LOGIN),
            status,
            mensagem
        );

        this.sessao = sessao;
    }

    public SessaoFrontend getSessao() {
        return sessao;
    }

    public void setSessao(SessaoFrontend sessao) {
        this.sessao = sessao;
    }
}