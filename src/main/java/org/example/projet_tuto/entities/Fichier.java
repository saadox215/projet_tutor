package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
public class Fichier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long taille;

    @Column(nullable = false)
    private LocalDateTime dateUpload;

    @Column(nullable = true)
    private String firebaseStoragePath;

    public Soumission getSoumission() {
        return soumission;
    }

    public void setSoumission(Soumission soumission) {
        this.soumission = soumission;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professeur_id", nullable = false)
    private Utilisateur professeur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "annonce_id", nullable = true)
    private Annonce annonce;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercice_id", nullable = true)
    private Exercice exercice;
    public Fichier(Long id, String nom, String url, String contentType, Long taille, LocalDateTime dateUpload, String firebaseStoragePath, Utilisateur professeur) {
        this.id = id;
        this.nom = nom;
        this.url = url;
        this.contentType = contentType;
        this.taille = taille;
        this.dateUpload = dateUpload;
        this.firebaseStoragePath = firebaseStoragePath;
        this.professeur = professeur;
    }
    @ManyToOne
    private Soumission soumission;

    public Fichier() {
    }

    public Fichier(Exercice exercice, Annonce annonce, Long id, String nom, String url, String contentType, Long taille, LocalDateTime dateUpload, String firebaseStoragePath, Utilisateur professeur) {
        this.exercice = exercice;
        this.annonce = annonce;
        this.id = id;
        this.nom = nom;
        this.url = url;
        this.contentType = contentType;
        this.taille = taille;
        this.dateUpload = dateUpload;
        this.firebaseStoragePath = firebaseStoragePath;
        this.professeur = professeur;
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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public LocalDateTime getDateUpload() {
        return dateUpload;
    }

    public void setDateUpload(LocalDateTime dateUpload) {
        this.dateUpload = dateUpload;
    }

    public Long getTaille() {
        return taille;
    }

    public void setTaille(Long taille) {
        this.taille = taille;
    }

    public String getFirebaseStoragePath() {
        return firebaseStoragePath;
    }

    public void setFirebaseStoragePath(String firebaseStoragePath) {
        this.firebaseStoragePath = firebaseStoragePath;
    }

    public Utilisateur getProfesseur() {
        return professeur;
    }

    public void setProfesseur(Utilisateur professeur) {
        this.professeur = professeur;
    }

    public Annonce getAnnonce() {
        return annonce;
    }

    public void setAnnonce(Annonce annonce) {
        this.annonce = annonce;
    }

    public Exercice getExercice() {
        return exercice;
    }

    public void setExercice(Exercice exercice) {
        this.exercice = exercice;
    }
    public static class FichierBuilder {
        private Long id;
        private String nom;
        private String url;
        private String contentType;
        private Long taille;
        private LocalDateTime dateUpload;
        private String firebaseStoragePath;
        private Utilisateur professeur;
        private Annonce annonce;
        private Exercice exercice;

        public FichierBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public FichierBuilder nom(String nom) {
            this.nom = nom;
            return this;
        }

        public FichierBuilder url(String url) {
            this.url = url;
            return this;
        }

        public FichierBuilder contentType(String contentType) {
            this.contentType = contentType;
            return this;
        }

        public FichierBuilder taille(Long taille) {
            this.taille = taille;
            return this;
        }

        public FichierBuilder dateUpload(LocalDateTime dateUpload) {
            this.dateUpload = dateUpload;
            return this;
        }

        public FichierBuilder firebaseStoragePath(String firebaseStoragePath) {
            this.firebaseStoragePath = firebaseStoragePath;
            return this;
        }

        public FichierBuilder professeur(Utilisateur professeur) {
            this.professeur = professeur;
            return this;
        }

        public FichierBuilder annonce(Annonce annonce) {
            this.annonce = annonce;
            return this;
        }

        public FichierBuilder exercice(Exercice exercice) {
            this.exercice = exercice;
            return this;
        }

        public Fichier build() {
            return new Fichier(exercice, annonce, id, nom, url, contentType, taille, dateUpload, firebaseStoragePath, professeur);
        }
    }

    public static FichierBuilder builder() {
        return new FichierBuilder();
    }
}