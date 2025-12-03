package com.example.enums;

public enum OperacaoPassageiro {
    SOLICITACAO("solicitar-corrida"),
    CANCELAMENTO("cancelar-corrida"),
    PAGAMENTO("processar-pagamento"),
    ADICIONAR_MEIO_PAGAMENTO("adicionar-meio-pagamento"),
    REMOVER_MEIO_PAGAMENTO("remover-meio-pagamento"),
    LISTAR_MEIO_PAGAMENTO("listar-meios-pagamento");

    private final String nome;
    OperacaoPassageiro(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}