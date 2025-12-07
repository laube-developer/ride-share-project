package com.example.controllers;

import com.example.entidades.Corrida;
import com.example.entidades.Motorista;
import com.example.entidades.Veiculo;
import com.example.enums.OperacaoEnum;
import com.example.enums.StatusCorridaEnum;
import com.example.enums.StatusMotoristaEnum;
import com.example.exceptions.EstadoInvalidoException;
import com.example.exceptions.MotoristaInvalidoException;
import com.example.exceptions.UsuarioOuSenhaIncorretosException;
import com.example.parametricos.CadastroAutenticavel;
import com.example.dtos.requisicao.CredenciaisLogin;

/**
 * MotoristaController - Camada de controle para operações de motorista
 * O tratamento de exceções é feito na classe RideShareProject.java
 */
public class MotoristaController {

    public static Motorista login(
        CredenciaisLogin credenciais,
        CadastroAutenticavel<Motorista> cadastro
    ) throws UsuarioOuSenhaIncorretosException {

        if (credenciais == null || cadastro == null) {
            throw new UsuarioOuSenhaIncorretosException("Motorista ou senha incorretos.");
        }

        Motorista m = cadastro.buscarPorEmail(credenciais.getEmail());
        
        if (m == null) {
            throw new UsuarioOuSenhaIncorretosException("Motorista ou senha incorretos.");
        }

        if (!m.verificarSenha(credenciais.getSenha())) {
            throw new UsuarioOuSenhaIncorretosException("Motorista ou senha incorretos.");
        }

        return m;
    }

    public static void ficarOnline(Motorista motorista) 
        throws MotoristaInvalidoException {

        boolean validadeCNH = motorista.getCNH() != null && motorista.getCNH().verificarValidade();
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
    }

    public static void ficarOffline(Motorista motorista) {

        motorista.setStatus(StatusMotoristaEnum.OFFLINE);
    }

    public static void aceitarCorrida(Motorista motorista, Corrida corrida) 
        throws EstadoInvalidoException, MotoristaInvalidoException {
        
        if (motorista == null || corrida == null) {
            throw new EstadoInvalidoException("Motorista ou corrida inválido.");
        }

        if (corrida.getStatus() != StatusCorridaEnum.SOLICITADA) {
            throw new EstadoInvalidoException("Corrida não está disponível para aceitar.");
        }

        if (motorista.getStatus() != StatusMotoristaEnum.ONLINE) {
            throw new EstadoInvalidoException("Motorista deve estar online para aceitar corrida.");
        }

        corrida.setMotorista(motorista);
        corrida.setStatus(StatusCorridaEnum.ACEITA);
    }

    public static void iniciarCorrida(Motorista motorista, Corrida corrida) 
        throws EstadoInvalidoException {
        
        if (motorista == null || corrida == null) {
            throw new EstadoInvalidoException("Motorista ou corrida inválido.");
        }

        if (corrida.getStatus() != StatusCorridaEnum.ACEITA) {
            throw new EstadoInvalidoException("Corrida deve estar aceita para iniciar.");
        }

        if (!corrida.getMotorista().equals(motorista)) {
            throw new EstadoInvalidoException("Apenas o motorista aceito pode iniciar a corrida.");
        }

        corrida.iniciarViagem();
    }

    public static void finalizarCorrida(Motorista motorista, Corrida corrida) 
        throws EstadoInvalidoException {
        
        if (motorista == null || corrida == null) {
            throw new EstadoInvalidoException("Motorista ou corrida inválido.");
        }

        if (corrida.getStatus() != StatusCorridaEnum.EM_ANDAMENTO) {
            throw new EstadoInvalidoException("Corrida deve estar em andamento para finalizar.");
        }

        if (!corrida.getMotorista().equals(motorista)) {
            throw new EstadoInvalidoException("Apenas o motorista da corrida pode finalizá-la.");
        }

        corrida.finalizarViagem();
    }

    public static void cancelarCorrida(Motorista motorista, Corrida corrida) 
        throws EstadoInvalidoException {
        
        if (motorista == null || corrida == null) {
            throw new EstadoInvalidoException("Motorista ou corrida inválido.");
        }

        if (!corrida.getMotorista().equals(motorista)) {
            throw new EstadoInvalidoException("Apenas o motorista da corrida pode cancelá-la.");
        }

        if (!corrida.cancelar()) {
            throw new EstadoInvalidoException("Não é possível cancelar esta corrida.");
        }
    }

    //Criar método para adicionar veículo

    public static void trocarVeiculo(Motorista motorista, Veiculo veiculo) 
        throws MotoristaInvalidoException, EstadoInvalidoException {
        
        if (motorista == null || veiculo == null) {
            throw new MotoristaInvalidoException("Motorista ou veículo inválido.");
        }

    // Fazer verificação de novo veiculo chamando um método de validação
        if (motorista.getStatus() == StatusMotoristaEnum.ONLINE) {
            throw new EstadoInvalidoException("Motorista deve estar offline para trocar veículo.");
        }

        motorista.setVeiculoAtivo(veiculo);
    }

    public static void removerVeiculo(Motorista motorista, Veiculo veiculo) 
        throws MotoristaInvalidoException, EstadoInvalidoException {
        
        if (motorista == null || veiculo == null) {
            throw new MotoristaInvalidoException("Motorista ou veículo inválido.");
        }

        if (motorista.getVeiculoAtivo().equals(veiculo)) {
            throw new EstadoInvalidoException("Não é possível remover o veículo ativo.");
        }

        motorista.removerVeiculo(veiculo);
    }

    public static int listarVeiculos(Motorista motorista) throws MotoristaInvalidoException {
        if (motorista == null) {
            throw new MotoristaInvalidoException("Motorista inválido.");
        }

        return motorista.getVeiculos().size();
    }
}