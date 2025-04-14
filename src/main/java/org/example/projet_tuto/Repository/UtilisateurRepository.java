package org.example.projet_tuto.Repository;

import org.example.projet_tuto.entities.Utilisateur;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    @EntityGraph(attributePaths = "roles") // Charge les rôles en même temps que l'utilisateur
    Optional<Utilisateur> findByEmail(String email);

}

