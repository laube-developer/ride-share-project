package com.example.dtos.resposta;

import com.example.entidades.CNH;
import com.example.enums.OperacaoEnum;

public class RespostaCNH extends Resposta{
    private CNH cnh;

    public RespostaCNH(
        CNH cnh,
        boolean status,
        String mensagem
    ){
        super(OperacaoEnum.MOTORISTA_CONSULTA_CNH, status, mensagem);

        this.cnh = cnh;
    }

    public CNH getCnh() {
        return cnh;
    }

    public void setCnh(CNH cnh) {
        this.cnh = cnh;
    }
}