package com.example.controllers;

import com.example.entidades.Corrida;
import com.example.entidades.Motorista;
import com.example.entidades.Veiculo;
import com.example.enums.OperacaoMotorista;
import com.example.enums.StatusCorridaEnum;
import com.example.enums.StatusMotoristaEnum;
import com.example.examples.Resposta;
import com.example.exceptions.EstadoInvalidoException;
import com.example.exceptions.MotoristaInvalidoException;
import com.example.exceptions.UsuarioOuSenhaIncorretosException;

public class MotoristaController {

    // ============ FICAR ONLINE ============
    public static Resposta ficarOnline(Motorista motorista) {
        try {
            if (motorista == null || !motorista.verificarSenha(motorista.getSenha())) {
                throw new UsuarioOuSenhaIncorretosException("Motorista ou senha incorretos.");
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
            return new Resposta(OperacaoMotorista.FICAR_ONLINE.getNome(), true, "Motorista ficou online.");

        } catch (UsuarioOuSenhaIncorretosException e) {
            return new Resposta(OperacaoMotorista.FICAR_ONLINE.getNome(), false, e.getMessage());
        } catch (MotoristaInvalidoException e) {
            return new Resposta(OperacaoMotorista.FICAR_ONLINE.getNome(), false, e.getMessage());
        } catch (Exception e) {
            return new Resposta(OperacaoMotorista.FICAR_ONLINE.getNome(), false, "Erro ao ficar online.");
        }
    }

    // ============ FICAR OFFLINE ============
    public static Resposta ficarOffline(Motorista motorista) {
        try {
            if (motorista == null) {
                throw new MotoristaInvalidoException("Motorista inválido.");
            }

            motorista.setStatus(StatusMotoristaEnum.OFFLINE);
            return new Resposta(OperacaoMotorista.FICAR_OFFLINE.getNome(), true, "Motorista ficou offline.");

        } catch (MotoristaInvalidoException e) {
            return new Resposta(OperacaoMotorista.FICAR_OFFLINE.getNome(), false, e.getMessage());
        } catch (Exception e) {
            return new Resposta(OperacaoMotorista.FICAR_OFFLINE.getNome(), false, "Erro ao ficar offline.");
        }
    }

    // ============ ACEITAR CORRIDA ============
    public static Resposta aceitarCorrida(Motorista motorista, Corrida corrida) {
        try {
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
            
            return new Resposta(OperacaoMotorista.ACEITAR_CORRIDA.getNome(), true, "Corrida aceita com sucesso.");

        } catch (EstadoInvalidoException e) {
            return new Resposta(OperacaoMotorista.ACEITAR_CORRIDA.getNome(), false, e.getMessage());
        } catch (Exception e) {
            return new Resposta(OperacaoMotorista.ACEITAR_CORRIDA.getNome(), false, "Erro ao aceitar corrida.");
        }
    }

    // ============ INICIAR CORRIDA ============
    public static Resposta iniciarCorrida(Motorista motorista, Corrida corrida) {
        try {
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
            return new Resposta(OperacaoMotorista.INICIAR_CORRIDA.getNome(), true, "Corrida iniciada com sucesso.");

        } catch (EstadoInvalidoException e) {
            return new Resposta(OperacaoMotorista.INICIAR_CORRIDA.getNome(), false, e.getMessage());
        } catch (Exception e) {
            return new Resposta(OperacaoMotorista.INICIAR_CORRIDA.getNome(), false, "Erro ao iniciar corrida.");
        }
    }

    // ============ FINALIZAR CORRIDA ============
    public static Resposta finalizarCorrida(Motorista motorista, Corrida corrida) {
        try {
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
            return new Resposta(OperacaoMotorista.FINALIZAR_CORRIDA.getNome(), true, "Corrida finalizada com sucesso.");

        } catch (EstadoInvalidoException e) {
            return new Resposta(OperacaoMotorista.FINALIZAR_CORRIDA.getNome(), false, e.getMessage());
        } catch (Exception e) {
            return new Resposta(OperacaoMotorista.FINALIZAR_CORRIDA.getNome(), false, "Erro ao finalizar corrida.");
        }
    }

    // ============ CANCELAR CORRIDA ============
    public static Resposta cancelarCorrida(Motorista motorista, Corrida corrida) {
        try {
            if (motorista == null || corrida == null) {
                throw new EstadoInvalidoException("Motorista ou corrida inválido.");
            }

            if (!corrida.getMotorista().equals(motorista)) {
                throw new EstadoInvalidoException("Apenas o motorista da corrida pode cancelá-la.");
            }

            if (!corrida.cancelar()) {
                throw new EstadoInvalidoException("Não é possível cancelar esta corrida.");
            }

            return new Resposta(OperacaoMotorista.CANCELAR_CORRIDA.getNome(), true, "Corrida cancelada com sucesso.");

        } catch (EstadoInvalidoException e) {
            return new Resposta(OperacaoMotorista.CANCELAR_CORRIDA.getNome(), false, e.getMessage());
        } catch (Exception e) {
            return new Resposta(OperacaoMotorista.CANCELAR_CORRIDA.getNome(), false, "Erro ao cancelar corrida.");
        }
    }

    // ============ TROCAR VEÍCULO ============
    public static Resposta trocarVeiculo(Motorista motorista, Veiculo veiculo) {
        try {
            if (motorista == null || veiculo == null) {
                throw new MotoristaInvalidoException("Motorista ou veículo inválido.");
            }

            if (motorista.getStatus() == StatusMotoristaEnum.ONLINE) {
                throw new EstadoInvalidoException("Motorista deve estar offline para trocar veículo.");
            }

            motorista.setVeiculoAtivo(veiculo);
            return new Resposta(OperacaoMotorista.TROCAR_VEICULO.getNome(), true, "Veículo ativo alterado com sucesso.");

        } catch (MotoristaInvalidoException e) {
            return new Resposta(OperacaoMotorista.TROCAR_VEICULO.getNome(), false, e.getMessage());
        } catch (EstadoInvalidoException e) {
            return new Resposta(OperacaoMotorista.TROCAR_VEICULO.getNome(), false, e.getMessage());
        } catch (Exception e) {
            return new Resposta(OperacaoMotorista.TROCAR_VEICULO.getNome(), false, "Erro ao trocar veículo.");
        }
    }

    // ============ REMOVER VEÍCULO ============
    public static Resposta removerVeiculo(Motorista motorista, Veiculo veiculo) {
        try {
            if (motorista == null || veiculo == null) {
                throw new MotoristaInvalidoException("Motorista ou veículo inválido.");
            }

            if (motorista.getVeiculoAtivo().equals(veiculo)) {
                throw new EstadoInvalidoException("Não é possível remover o veículo ativo.");
            }

            motorista.removerVeiculo(veiculo);
            return new Resposta(OperacaoMotorista.REMOVER_VEICULO.getNome(), true, "Veículo removido com sucesso.");

        } catch (MotoristaInvalidoException e) {
            return new Resposta(OperacaoMotorista.REMOVER_VEICULO.getNome(), false, e.getMessage());
        } catch (EstadoInvalidoException e) {
            return new Resposta(OperacaoMotorista.REMOVER_VEICULO.getNome(), false, e.getMessage());
        } catch (Exception e) {
            return new Resposta(OperacaoMotorista.REMOVER_VEICULO.getNome(), false, "Erro ao remover veículo.");
        }
    }

    // ============ LISTAR VEÍCULOS ============
    public static Resposta listarVeiculos(Motorista motorista) {
        try {
            if (motorista == null) {
                throw new MotoristaInvalidoException("Motorista inválido.");
            }

            int totalVeiculos = motorista.getVeiculos().size();
            String mensagem = totalVeiculos > 0 ? 
                "Total de veículos: " + totalVeiculos : 
                "Nenhum veículo cadastrado.";

            return new Resposta(OperacaoMotorista.LISTAR_VEICULOS.getNome(), true, mensagem);

        } catch (MotoristaInvalidoException e) {
            return new Resposta(OperacaoMotorista.LISTAR_VEICULOS.getNome(), false, e.getMessage());
        } catch (Exception e) {
            return new Resposta(OperacaoMotorista.LISTAR_VEICULOS.getNome(), false, "Erro ao listar veículos.");
        }
    }
}