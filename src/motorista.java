public class motorista extends usuario {
    veiculo veiculo;
    //veiculo ativo atributo
    cnh cnh;
    status status;
    
    public motorista(String nome, String email, String senha, String cpf, String telefone) {
        super(nome, email, senha, cpf, telefone);
        
    }

    // Getters e Setters
    public cnh getCnh() {
        return cnh;
    }

    public void setCnh(cnh cnh) {
        this.cnh = cnh;
    }

    public veiculo getVeiculo() {
        return veiculo;
    }

    public veiculo getveiculoAtivo() {
        return veiculo;
        // Lógica para retornar o veículo ativo
    }

    public void adicionarveiculo(veiculo veiculo) {
        this.veiculo = veiculo;
    }

    public void removerveiculo() {
        this.veiculo = null;
    }

    public status getStatus(cnh cnh) {
        return status;
    }

    public void trocarveiculo(veiculo veiculo) {
        // Lógica para trocar o veículo
    }
}
