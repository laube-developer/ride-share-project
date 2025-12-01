package com.example.enums;

public enum OperacaoPassageiro {
    SOLICITACAO("solicitar-corrida"),
    CANCELAMENTO("cancelar-corrida"),
    PAGAMENTO("processar-pagamento");
    	//private static final String OPERACAO_ADC_MEIO_PAG = "adicionar-meio-pagamento";
    	//private static final String OPERACAO_RMV_MEIO_PAG = "remover-meio-pagamento";
    	//private static final String OPERACAO_LIST_MEIO_PAG = "listar-meios-pagamento";

    private final String nome;
    OperacaoPassageiro(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}