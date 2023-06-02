package api.guicheSenhas.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import api.guicheSenhas.models.Senha;

@Repository
public interface SenhaRepository extends JpaRepository<Senha, Long> {

}
