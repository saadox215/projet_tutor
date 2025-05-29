package org.example.projet_tuto.Repository;

import org.example.projet_tuto.entities.Fichier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FichierRepository extends JpaRepository<Fichier, Long> {
    Fichier findBySoumissionId(Long assignmentId);
}
