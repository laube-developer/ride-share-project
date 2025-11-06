public class avaliacao {
    usuario usuarioAvaliador;
    usuario usuarioAvaliado;
    notaenum nota;
    long totalAvaliacoes;

    public avaliacao(usuario usuarioAvaliador, usuario usuarioAvaliado, notaenum nota) {
        this.usuarioAvaliador = usuarioAvaliador;
        this.usuarioAvaliado = usuarioAvaliado;
        this.nota = nota;
    }

    // Getters e Setters
    public usuario getUsuarioAvaliador(usuario usuarioAvaliador) {
        return usuarioAvaliador;
    }

    public usuario getUsuarioAvaliado(usuario usuarioAvaliado) {
        return usuarioAvaliado;
    }

    //mudar o contar avaliacao que tem dois e não entendi o que fazer



}
