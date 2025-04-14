package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Soumission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date dateSoumission;
    private float note;

    @ManyToOne
    @JoinColumn(name = "exercice_id")
    private Exercice exercice;

    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    private Utilisateur etudiant;
}

