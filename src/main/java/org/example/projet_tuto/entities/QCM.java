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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public Date getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Utilisateur getProfesseur() {
        return professeur;
    }

    public void setProfesseur(Utilisateur professeur) {
        this.professeur = professeur;
    }

    public Classe getClasse() {
        return classe;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public Set<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(Set<Question> questions) {
        this.questions = questions;
    }

    @ManyToOne
    @JoinColumn(name = "classe_id")
    private Classe classe;

    @OneToMany(mappedBy = "qcm", cascade = CascadeType.ALL)
    private Set<Question> questions;
}


