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
    private String nomFichier;
    @Column(columnDefinition = "TEXT")
    private String texte;

    private Date dateSoumission;
    private float note;

    @ManyToOne
    @JoinColumn(name = "exercice_id")
    private Exercice exercice;

    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    private Utilisateur etudiant;

    @Override
    public String toString() {
        return nomFichier;}

    public void setNomFichier(String nomFichier) {
        this.nomFichier = nomFichier;
    }

    public void setTexte(String texte) {
        this.texte = texte;
    }
    public void setDateSoumission(Date date) {
        this.dateSoumission = date;
    }

    public void setNote(float note) {
        this.note = note;
    }

}

