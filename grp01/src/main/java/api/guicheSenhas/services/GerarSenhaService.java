package api.guicheSenhas.services;

import java.util.Random;

import org.springframework.stereotype.Service;

import api.guicheSenhas.models.Senha;
import api.guicheSenhas.repositorio.SenhaRepository;

@Service
public class GerarSenhaService {

    private final SenhaRepository senhaRepository;

    public GerarSenhaService(SenhaRepository senhaRepository) {
        this.senhaRepository = senhaRepository;
    }

    public String gerarSenha(String prioridade) {
        String senhaGerada;

        if (prioridade.equalsIgnoreCase("p")) {
            senhaGerada = gerarSenhaPrioritaria();
        } else if (prioridade.equalsIgnoreCase("e")) {
            senhaGerada = gerarSenhaExame();
        } else {
            senhaGerada = gerarSenhaGeral();
        }

        salvarSenhaNoBanco(senhaGerada);

        return senhaGerada;
    }

    private void salvarSenhaNoBanco(String senha) {
        Senha senhaObj = new Senha(senha, false);
        senhaObj.setSenha(senha);
        senhaRepository.save(senhaObj);
    }

    private String gerarSenhaPrioritaria() {
        return "P" + generateRandomNumber();
    }

    private String gerarSenhaExame() {
        return "E" + generateRandomNumber();
    }

    private String gerarSenhaGeral() {
        return "G" + generateRandomNumber();
    }

    private int generateRandomNumber() {
        return new Random().nextInt(1000);
    }
}
