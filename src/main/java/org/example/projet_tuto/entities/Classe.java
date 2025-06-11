package org.example.projet_tuto.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
public class Classe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    public Classe(Long id, String nom, Set<Utilisateur> etudiants, Set<Annonce> annonces, Set<Exercice> exercices , List<Utilisateur> enseignants) {
        this.id = id;
        this.nom = nom;
        this.etudiants = etudiants;
        this.annonces = annonces;
        this.exercices = exercices;
        this.enseignants = enseignants;
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


    @OneToMany(mappedBy = "classe", fetch = FetchType.EAGER)
    private Set<Utilisateur> etudiants;


    @OneToMany(mappedBy = "classe")
    private Set<Annonce> annonces;

    @OneToMany(mappedBy = "classe")
    private Set<Exercice> exercices;

    @ManyToMany
    @JoinTable(
            name = "classe_enseignants",
            joinColumns = @JoinColumn(name = "classe_id"),
            inverseJoinColumns = @JoinColumn(name = "enseignant_id")
    )
    private List<Utilisateur> enseignants = new ArrayList<>();

    public List<Utilisateur> getEnseignants() {
        return enseignants;
    }

    public void setEnseignants(List<Utilisateur> enseignants) {
        this.enseignants = enseignants;
    }

    public Set<LiveStreaming> getLiveStreamings() {
        return liveStreamings;
    }

    public void setLiveStreamings(Set<LiveStreaming> liveStreamings) {
        this.liveStreamings = liveStreamings;
    }

    @OneToMany(mappedBy = "classe")
    private Set<LiveStreaming> liveStreamings;
}


