package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
public class Classe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    public Classe(Long id, String nom, Set<Utilisateur> etudiants, Set<Annonce> annonces, Set<Exercice> exercices, Utilisateur enseignant) {
        this.id = id;
        this.nom = nom;
        this.etudiants = etudiants;
        this.annonces = annonces;
        this.exercices = exercices;
        this.enseignant = enseignant;
    }

    public Classe() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Utilisateur> getEtudiants() {
        return etudiants;
    }

    public void setEtudiants(Set<Utilisateur> etudiants) {
        this.etudiants = etudiants;
    }

    public Set<Annonce> getAnnonces() {
        return annonces;
    }

    public void setAnnonces(Set<Annonce> annonces) {
        this.annonces = annonces;
    }

    public Set<Exercice> getExercices() {
        return exercices;
    }

    public void setExercices(Set<Exercice> exercices) {
        this.exercices = exercices;
    }

    public Utilisateur getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Utilisateur enseignant) {
        this.enseignant = enseignant;
    }

    @OneToMany(mappedBy = "classe", fetch = FetchType.EAGER)
    private Set<Utilisateur> etudiants;


    @OneToMany(mappedBy = "classe")
    private Set<Annonce> annonces;

    @OneToMany(mappedBy = "classe")
    private Set<Exercice> exercices;

    @ManyToOne
    @JoinColumn(name = "enseignant_id")
    private Utilisateur enseignant;
}


