package com.example.controllers;

import com.example.entidades.Motorista;
import com.example.servicos.Operacao;
import com.example.exceptions.MotoristaInvalidoException;
import com.example.enums.StatusMotoristaEnum;

public static class MotoristaController {
    private String nomeOperacao = "ficar-online";
    
    public static Operacao ficarOnline(Motorista motorista) {
        try {
            boolean validadeCNH = motorista.getCNH().isValida();
            boolean validadeVeiculo = motorista.getVeiculoAtivo() != null && motorista.getVeiculoAtivo().isDocumentacaoValida();

            if (!validadeCNH || !validadeVeiculo) {
                String mensagemErro = "";

                if (!validadeCNH) {
                    mensagemErro += "CNH inválida. ";
                }
                if (!validadeVeiculo) {
                    mensagemErro += "Documentação do veículo inválida.";
                }
                throw new MotoristaInvalidoException(mensagemErro.trim());
            }

            motorista.setStatus(StatusMotoristaEnum.ONLINE);

        } catch (MotoristaInvalidoException e) {
            return new Operacao(
                nomeOperacao
                false,
                e.message
            );

        } catch (Exception e) {
            return new Operacao(
                nomeOperacao
                false,
                "Erro ao atualizar status do motorista para ONLINE."
            );
        }
        
    }
}