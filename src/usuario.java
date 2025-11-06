public class Usuario {
    String nome;
    String email;
    String senha;
    String cpf;
    String telefone;
    avaliacao avaliacao;

    
    // Construtor
    public usuario(String nome, String email, String senha, String cpf, String telefone) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.cpf = cpf;
        this.telefone = telefone;
    }

        // Getters e Setters
        

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String setSenha() {
        	return senha;
        }

        public boolean verificarSenha(String senha) {
        	return this.senha == senha;
        }

<<<<<<< HEAD
        public Avaliacao getAvaliacao() {
=======
        public float avaliacao getAvaliacao() {
>>>>>>> ce9853bfb68f0aa27cd47d54ffe215fadcbd0ed4
            return avaliacao;
        }

        public String getCPF() {
            return cpf;
        }

        public void setCPF(String cpf) {
            this.cpf = cpf;
        }

        public String getTelefone() {
            return telefone;
        }

        public void setTelefone(String telefone) {
            this.telefone = telefone;
        }
}

    
