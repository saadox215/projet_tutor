package org.example.projet_tuto.Repository;


import org.example.projet_tuto.entities.Soumission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SoumissionRepository extends JpaRepository<Soumission, Long> {
}

