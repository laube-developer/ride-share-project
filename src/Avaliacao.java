public class Avaliacao {
    Usuario usuarioAvaliador;
    Usuario usuarioAvaliado;
    notaenum nota;
    //não entendi oq é o unsigned long total de avaliações

    public Avaliacao(Usuario usuarioAvaliador, Usuario usuarioAvaliado, notaenum nota) {
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

    //mudar o contar avaliacao que tem dois e não entendi o que fazer



}
