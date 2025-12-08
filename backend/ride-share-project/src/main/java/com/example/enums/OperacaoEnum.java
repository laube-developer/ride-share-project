package com.example.enums;

public enum OperacaoEnum {
    // Passageiro operations
    PASSAGEIRO_SOLICITACAO("passageiro-solicitar-corrida"),
    PASSAGEIRO_CANCELAMENTO("passageiro-cancelar-corrida"),
    PASSAGEIRO_PAGAMENTO("passageiro-processar-pagamento"),
    PASSAGEIRO_ADICIONAR_MEIO_PAGAMENTO("passageiro-adicionar-meio-pagamento"),
    PASSAGEIRO_REMOVER_MEIO_PAGAMENTO("passageiro-remover-meio-pagamento"),
    PASSAGEIRO_LISTAR_MEIO_PAGAMENTO("passageiro-listar-meios-pagamento"),
    PASSAGEIRO_LOGIN("passageiro-login"),
    PASSAGEIRO_LOGOUT("passageiro-logout"),
    PASSAGEIRO_ALTERAR_DADOS("passageiro-alterar-dados"),
    // Motorista operations
    MOTORISTA_FICAR_ONLINE("motorista-ficar-online"),
    MOTORISTA_FICAR_OFFLINE("motorista-ficar-offline"),
    MOTORISTA_ACEITAR_CORRIDA("motorista-aceitar-corrida"),
    MOTORISTA_INICIAR_CORRIDA("motorista-iniciar-corrida"),
    MOTORISTA_CANCELAR_CORRIDA("motorista-cancelar-corrida"),
    MOTORISTA_FINALIZAR_CORRIDA("motorista-finalizar-corrida"),
    MOTORISTA_ADICIONAR_VEICULO("motorista-adicionar-veiculo"),
    MOTORISTA_TROCAR_VEICULO("motorista-trocar-veiculo"),
    MOTORISTA_REMOVER_VEICULO("motorista-remover-veiculo"),
    MOTORISTA_LISTAR_VEICULOS("motorista-listar-veiculos"),
    MOTORISTA_LOGIN("motorista-login"),
    MOTORISTA_LOGOUT("motorista-logout"),
    MOTORISTA_ALTERAR_DADOS("motorista-alterar-dados");

    private final String nome;
    OperacaoEnum(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}