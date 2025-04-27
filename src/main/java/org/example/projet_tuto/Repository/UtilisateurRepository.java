package org.example.projet_tuto.Repository;

import org.example.projet_tuto.entities.Classe;
import org.example.projet_tuto.entities.RoleType;
import org.example.projet_tuto.entities.Utilisateur;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Utilisateur findByEmail(String email);

    Optional<Utilisateur> findByNameAndRoles_Name(String name, RoleType roleName);

    @Query("SELECT COUNT(u) FROM Utilisateur u JOIN u.roles r WHERE r.name = :roleName")
    long countByRoleName(@Param("roleName") RoleType roleName);

    @Query("SELECT u FROM Utilisateur u JOIN u.roles r WHERE r.name = :roleName")
    List<Utilisateur> findByRoles_Name(@Param("roleName") RoleType roleName);

    List<Utilisateur> findByClasse(Classe classe);

}