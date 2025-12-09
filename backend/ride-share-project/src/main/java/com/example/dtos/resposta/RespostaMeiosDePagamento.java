package com.example.dtos.resposta;

import java.util.List;

import com.example.entidades.MeioDePagamento;
import com.example.enums.OperacaoEnum;;

public class RespostaMeiosDePagamento extends Resposta{
    private List<MeioDePagamento> meiosDePagamento;

    public RespostaMeiosDePagamento(
        List<MeioDePagamento> meiosDePagamento,
        boolean status,
        String mensagem
    ){
        super(OperacaoEnum.PASSAGEIRO_OBTER_MEIOS_PAGAMENTO, status, mensagem);

        this.meiosDePagamento = meiosDePagamento;
    }

    public List<MeioDePagamento> getMeiosDePagamento() {
        return meiosDePagamento;
    }

    public void setMeiosDePagamento(List<MeioDePagamento> meiosDePagamento) {
        this.meiosDePagamento = meiosDePagamento;
    }
    
}
