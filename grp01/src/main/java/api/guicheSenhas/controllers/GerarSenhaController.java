package api.guicheSenhas.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import api.guicheSenhas.services.GerarSenhaService;

@RestController
@RequestMapping("/gerar-senha")
public class GerarSenhaController {

    private final GerarSenhaService gerarSenhaService;

    public GerarSenhaController(GerarSenhaService gerarSenhaService) {
        this.gerarSenhaService = gerarSenhaService;
    }

    @PostMapping
    public ResponseEntity<String> gerarSenha(@RequestParam String prioridade) {
        String senha = gerarSenhaService.gerarSenha(prioridade);
        return ResponseEntity.ok(senha);
    }
}
