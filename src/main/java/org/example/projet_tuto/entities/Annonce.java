package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Annonce {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;
    private String contenu;
    private Date datePublication;

    @ManyToOne
    @JoinColumn(name = "professeur_id")
    private Utilisateur professeur;

    @ManyToOne
    @JoinColumn(name = "classe_id")
    private Classe classe;

    @OneToMany(mappedBy = "annonce", cascade = CascadeType.ALL)
    private Set<Fichier> fichiers;

}
