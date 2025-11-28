package com.example.controllers;

import com.example.entidades.Motorista;
import com.example.enums.StatusMotoristaEnum;
import com.example.examples.Operacao;
import com.example.exceptions.MotoristaInvalidoException;
//Nao sei se devo adicionar o UsuarioouSenhaIncorretosException aqui...


public class MotoristaController {
    private static final String NOME_OPERACAO = "ficar-online";
    
    public static Operacao ficarOnline(Motorista motorista) {
        try {
            if (motorista == null) {
                throw new MotoristaInvalidoException("Motorista nao informado.");
            }

            boolean validadeCNH = motorista.getCNH() != null && motorista.getCNH().verificarValidade();
            boolean validadeVeiculo = motorista.getVeiculoAtivo() != null && motorista.getVeiculoAtivo().isDocumentacaoValida();

            if (!validadeCNH || !validadeVeiculo) {
                String mensagemErro = "";

                if (!validadeCNH) {
                    mensagemErro += "CNH invalida. ";
                }
                if (!validadeVeiculo) {
                    mensagemErro += "Documentacao do veiculo invalida.";
                }
                throw new MotoristaInvalidoException(mensagemErro.trim());
            }

            motorista.setStatus(StatusMotoristaEnum.ONLINE);
            return new Operacao(NOME_OPERACAO, true, "Motorista ficou online.");

        } catch (MotoristaInvalidoException e) {
            return new Operacao(
                NOME_OPERACAO,
                false,
                e.getMessage()
            );

        } catch (Exception e) {
            return new Operacao(
                NOME_OPERACAO,
                false,
                "Erro ao atualizar status do motorista para ONLINE."
            );
        }
        
    }
}
