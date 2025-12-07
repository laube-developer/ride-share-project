package com.example.enums;

public enum OperacaoEnum {
    PASSAGEIRO_SOLICITACAO("passageiro-solicitar-corrida"),
    PASSAGEIRO_CANCELAMENTO("passageiro-cancelar-corrida"),
    PASSAGEIRO_PAGAMENTO("passageiro-processar-pagamento"),
    PASSAGEIRO_ADICIONAR_MEIO_PAGAMENTO("passageiro-adicionar-meio-pagamento"),
    PASSAGEIRO_REMOVER_MEIO_PAGAMENTO("passageiro-remover-meio-pagamento"),
    PASSAGEIRO_LISTAR_MEIO_PAGAMENTO("passageiro-listar-meios-pagamento"),
    PASSAGEIRO_LOGIN("passageiro-login"),
    PASSAGEIRO_LOGOUT("passageiro-logout"),
    PASSAGEIRO_ALTERAR_DADOS("passageiro-alterar-dados");

    private final String nome;
    OperacaoEnum(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}