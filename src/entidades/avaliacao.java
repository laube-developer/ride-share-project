package entidades;

import enums.NotaEnum;

public class Avaliacao {
    private Usuario usuarioAvaliador;
    private Usuario usuarioAvaliado;
    private NotaEnum nota;
    private long totalAvaliacoes;

    public Avaliacao(Usuario usuarioAvaliador, Usuario usuarioAvaliado, NotaEnum nota) {
        this.usuarioAvaliador = usuarioAvaliador;
        this.usuarioAvaliado = usuarioAvaliado;
        this.nota = nota;
    }

    // Getters e Setters
    public Usuario getUsuarioAvaliador(Usuario usuarioAvaliador) {
        return usuarioAvaliador;
    }

    public Usuario getUsuarioAvaliado(Usuario usuarioAvaliado) {
        return usuarioAvaliado;
    }
    
    public NotaEnum getNota() {
    		return nota;
    }

}
