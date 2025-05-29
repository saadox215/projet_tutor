package org.example.projet_tuto.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
public class Soumission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateSoumission;
    private float note;

    @OneToMany(mappedBy = "soumission", cascade = CascadeType.ALL)
    private List<Fichier> fichiers;

    @ManyToOne
    @JoinColumn(name = "exercice_id")
    private Exercice exercice;

    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    private Utilisateur etudiant;

    public Soumission() {
    }

    public Soumission(Long id, LocalDate dateSoumission, float note, Exercice exercice, List<Fichier> fichiers, Utilisateur etudiant) {
        this.id = id;
        this.dateSoumission = dateSoumission;
        this.note = note;
        this.exercice = exercice;
        this.fichiers = fichiers;
        this.etudiant = etudiant;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateSoumission() {
        return dateSoumission;
    }

    public void setDateSoumission(LocalDate dateSoumission) {
        this.dateSoumission = dateSoumission;
    }

    public float getNote() {
        return note;
    }

    public void setNote(float note) {
        this.note = note;
    }

    public List<Fichier> getFichiers() {
        return fichiers;
    }

    public void setFichiers(List<Fichier> fichiers) {
        this.fichiers = fichiers;
    }

    public Exercice getExercice() {
        return exercice;
    }

    public void setExercice(Exercice exercice) {
        this.exercice = exercice;
    }

    public Utilisateur getEtudiant() {
        return etudiant;
    }

    public void setEtudiant(Utilisateur etudiant) {
        this.etudiant = etudiant;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private LocalDate dateSoumission;
        private float note;
        private List<Fichier> fichiers;
        private Exercice exercice;
        private Utilisateur etudiant;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder dateSoumission(LocalDate dateSoumission) {
            this.dateSoumission = dateSoumission;
            return this;
        }

        public Builder note(Float note) {
            this.note = note;
            return this;
        }

        public Builder fichiers(List<Fichier> fichiers) {
            this.fichiers = fichiers;
            return this;
        }

        public Builder exercice(Exercice exercice) {
            this.exercice = exercice;
            return this;
        }

        public Builder etudiant(Utilisateur etudiant) {
            this.etudiant = etudiant;
            return this;
        }

        public Soumission build() {
            Soumission soumission = new Soumission();
            soumission.setId(this.id);
            soumission.setDateSoumission(this.dateSoumission);
            soumission.setNote(this.note);
            soumission.setFichiers(this.fichiers);
            soumission.setExercice(this.exercice);
            soumission.setEtudiant(this.etudiant);
            return soumission;
        }

        public Builder utilisateur(Utilisateur student) {
            this.etudiant = student;
            return this;
        }
    }
}