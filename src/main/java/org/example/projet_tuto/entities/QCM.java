package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;
import java.util.Date;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class QCM {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private Date dateCreation;

    @ManyToOne
    @JoinColumn(name = "professeur_id")
    private Utilisateur professeur;

    @ManyToOne
    @JoinColumn(name = "classe_id")
    private Classe classe;

    @OneToMany(mappedBy = "qcm", cascade = CascadeType.ALL)
    private Set<Question> questions;
}


