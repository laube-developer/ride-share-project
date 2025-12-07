package com.example.enums;

public enum OperacaoMotorista {
    FICAR_ONLINE("ficar-online"),
    FICAR_OFFLINE("ficar-offline"),
    ACEITAR_CORRIDA("aceitar-corrida"),
    INICIAR_CORRIDA("iniciar-corrida"),
    CANCELAR_CORRIDA("cancelar-corrida"),
    FINALIZAR_CORRIDA("finalizar-corrida"),
    TROCAR_VEICULO("trocar-veiculo"),
    REMOVER_VEICULO("remover-veiculo"),
    LISTAR_VEICULOS("listar-veiculos");

    private final String nome;
    
    OperacaoMotorista(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}
