package org.example.projet_tuto.Repository;

import org.example.projet_tuto.entities.Soumission;
import org.example.projet_tuto.entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoumissionRepository extends JpaRepository<Soumission, Long> {

    // Récupérer les soumissions faites par un étudiant donné
    List<Soumission> findByEtudiant(Utilisateur etudiant);
}
