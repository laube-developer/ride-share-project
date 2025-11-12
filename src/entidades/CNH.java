package entidades;

import java.time.LocalDate;

public class CNH {
    String numero;
    LocalDate validade;

    public CNH(String numero, LocalDate validade) {
        this.numero = numero;
        this.validade = validade;
    }
    
    // Getters e Setters
    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public LocalDate getValidade() {
        return validade;
    }

    public void setValidade(LocalDate validade) {
        this.validade = validade;
    }

    public void verificarvalidade(){
        LocalDate hoje = LocalDate.now();
        if (validade.isBefore(hoje)) {
            System.out.println("CNH vencida");
        } else {
            System.out.println("CNH válida");
        }
    }
}
