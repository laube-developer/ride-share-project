public class Operacao {
    private String nome;
    private boolean status = true;
    private String mensagem = "Operação realizada com sucesso.";

    Operacao(, String nome, boolean status, String mensagem) {
        this.nome = nome;
        this.status = status;
        this.mensagem = mensagem;
    }

    public String json(){
        return "{ "status": " + status + ", "mensagem": "" + mensagem + "" }";
    };

    public setNome(String nome) {
        this.nome = nome;
        return this.nome;
    }

    public boolean setStatus(boolean status) {
        this.status = status;
        return this.status;
    }

    public String setMensagem(String mensagem) {
        this.mensagem = mensagem;
        return this.mensagem;
    }

}
