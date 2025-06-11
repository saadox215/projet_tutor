package org.example.projet_tuto.Repository;

import org.example.projet_tuto.entities.Classe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClasseRepository extends JpaRepository<Classe, Long> {

}
