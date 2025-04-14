package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public RoleType getNom() {
        return nom;
    }

    public Long getId() {
        return id;
    }

    public Role() {
    }

    public Role(Long id, RoleType nom) {
        this.id = id;
        this.nom = nom;
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RoleType nom;
}

