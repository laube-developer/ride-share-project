package com.example.exceptions;

/* Classe que abrange 5 exceptions diferentes:
- Passageiro tenta iniciar corrida ja estando em uma.
- Passageiro tenta pagar a corrida antes de finalizar a corrida.
- Passageiro tenta cancelar corrida que ja foi finalizada.
- Motorista tenta finalizar corrida que ainda nao iniciou.
- Motorista tenta cancelar corrida que nao foi iniciada ou ja foi cancelada.
*/ 

public class EstadoInvalidoException extends Exception {
        public EstadoInvalidoException(String message) {
        super(message);
    }    
        public EstadoInvalidoException() {
        super("Erro - Ação não permitida.");
    }
}