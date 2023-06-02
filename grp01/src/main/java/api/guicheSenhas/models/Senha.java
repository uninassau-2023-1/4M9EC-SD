package api.guicheSenhas.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "senhas")
public class Senha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id_senha;

    @Column(nullable = false)
    private String numero;

    @Column(nullable = false)
    private boolean atendida;
    
    @ManyToOne
    @JoinColumn(name = "id_prioridade")
    private Prioridade prioridade;
    // Construtores, getters e setters

    

    public Senha(String numero, boolean atendida) {
        this.numero = numero;
        this.atendida = atendida;
    }

    private String senha;

    public void setSenha(String senha) {
        this.senha = senha;
    }

    // getters e setters

    // ...
}
