package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Classe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @OneToMany(mappedBy = "classe")
    private Set<Utilisateur> etudiants;

    @OneToMany(mappedBy = "classe")
    private Set<Annonce> annonces;

    @OneToMany(mappedBy = "classe")
    private Set<Exercice> exercices;
}


