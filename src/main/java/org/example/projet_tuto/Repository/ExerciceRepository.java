package org.example.projet_tuto.Repository;

import org.example.projet_tuto.entities.Exercice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciceRepository extends JpaRepository<Exercice, Long> {
    List<Exercice> findByClasseId(Long classeId);
    List<Exercice> findByProfesseurId(Long professeurId);

    List<Exercice> findByClasseIdOrderByDatePubDesc(Long classeId);

    List<Exercice> findByProfesseurIdOrderByDatePubDesc(Long professeurId);
}
