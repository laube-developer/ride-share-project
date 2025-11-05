public class usuario {
    String nome;
    String email;
    String senha;
    float saldoTotal;
    String cpf;
    String telefone;

    
    // Construtor
    public usuario(String nome, String email, String senha, float saldoTotal, String cpf, String telefone) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.saldoTotal = saldoTotal;
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

        public float getSaldoTotal() {
            return saldoTotal;
        }

        public void setSaldoTotal(float saldoTotal) {
            this.saldoTotal = saldoTotal;
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

    

