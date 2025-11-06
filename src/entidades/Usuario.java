package entidades;

import java.util.List;

public class Usuario {
    String nome;
    String email;
    String senha;
    String cpf;
    String telefone;
    float avaliacao;
    List<Avaliacao> avaliacoes;
    int somaTotalAvaliacoes;

     Usuario(String nome, String email, String senha, String cpf, String telefone) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.cpf = cpf;
        this.telefone = telefone;
        this.avaliacoes = List.of();
        this.somaTotalAvaliacoes = 0;
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
        
        public float getAvaliacao() {
            return avaliacao;
        }
        
        public Avaliacao getAvaliacaoById(int id) {
        		return avaliacoes.get(id);
        }
        
        public void addAvaliacao(Avaliacao a) {
        		avaliacoes.add(a);
        		somaTotalAvaliacoes += a.getNota().getValor();
        		avaliacao = somaTotalAvaliacoes / avaliacoes.size();
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

    
