package org.example.projet_tuto.Repository;

import org.example.projet_tuto.entities.Soumission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoumissionRepository extends JpaRepository<Soumission, Long> {
    boolean existsByExerciceIdAndEtudiantId(Long soumissionId, Long id);
}
