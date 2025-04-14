package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Fichier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String url; // lien vers le fichier

    @ManyToOne
    @JoinColumn(name = "professeur_id")
    private Utilisateur professeur;

    @ManyToOne
    @JoinColumn(name = "annonce_id", nullable = true)
    private Annonce annonce;

    @ManyToOne
    @JoinColumn(name = "exercice_id", nullable = true)
    private Exercice exercice;
}

