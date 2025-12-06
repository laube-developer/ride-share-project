package com.example.controllers;

import com.example.entidades.Motorista;
import com.example.enums.StatusMotoristaEnum;
import com.example.examples.Resposta;
import com.example.exceptions.MotoristaInvalidoException;
import com.example.exceptions.UsuarioouSenhaIncorretosException;


public class MotoristaController {

    private static final String OPERACAO_ONLINE = "ficar-online";
    private static final String OPERACAO_OFFLINE = "ficar-offline";
    private static final String OPERACAO_ACEITAR = "aceitar-corrida";
    private static final String OPERACAO_INICIAR = "iniciar-corrida";ç.l
    private static final String OPERACAO_CANCELAR = "cancelar-corrida";
    private static final String OPERACAO_FINALIZAR = "finalizar-corrida";
    
    public static Operacao ficarOnline(Motorista motorista) throws UsuarioouSenhaIncorretosException, MotoristaInvalidoException {
        try {
            if (motorista == null || !motorista.verificarSenha(motorista.getSenha())) {
                throw new UsuarioouSenhaIncorretosException("Motorista ou senha incorretos.");
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
            return new Operacao(OPERACAO_ONLINE, true, "Motorista ficou online.");

        } catch (MotoristaInvalidoException e) {
            return new Operacao(
                OPERACAO_ONLINE,
                false,
                e.getMessage()
            );

        } catch (UsuarioouSenhaIncorretosException e) {
            return new Operacao(
                OPERACAO_ONLINE,
                false,
                e.getMessage()
            );

        } catch (Exception e) {
            return new Operacao(
                OPERACAO_ONLINE,
                false,
            );
        }
