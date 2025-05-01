package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Exercice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime datePub;

    @Column(nullable = false)
    private LocalDateTime dateLimite;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean archived = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professeur_id", nullable = false)
    private Utilisateur professeur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classe_id", nullable = false)
    private Classe classe;

    @OneToMany(mappedBy = "exercice", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Fichier> fichiers = new HashSet<>();

    public Exercice(Long id, String titre, String description, LocalDateTime datePub, LocalDateTime dateLimite, boolean archived, Utilisateur professeur, Classe classe, Set<Fichier> fichiers) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.datePub = datePub;
        this.dateLimite = dateLimite;
        this.archived = archived;
        this.professeur = professeur;
        this.classe = classe;
        this.fichiers = fichiers;
    }

    public Exercice() {
    }

    public static Builder builder() {
        return new Builder();
    }

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDatePub() {
        return datePub;
    }

    public void setDatePub(LocalDateTime datePub) {
        this.datePub = datePub;
    }

    public LocalDateTime getDateLimite() {
        return dateLimite;
    }

    public void setDateLimite(LocalDateTime dateLimite) {
        this.dateLimite = dateLimite;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
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

    public Set<Fichier> getFichiers() {
        return fichiers;
    }

    public void setFichiers(Set<Fichier> fichiers) {
        this.fichiers = fichiers;
    }
    public static class Builder {
        private Long id;
        private String titre;
        private String description;
        private LocalDateTime datePub;
        private LocalDateTime dateLimite;
        private boolean archived = false;
        private Utilisateur professeur;
        private Classe classe;
        private Set<Fichier> fichiers = new HashSet<>();

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder titre(String titre) {
            this.titre = titre;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder datePub(LocalDateTime datePub) {
            this.datePub = datePub;
            return this;
        }

        public Builder dateLimite(LocalDateTime dateLimite) {
            this.dateLimite = dateLimite;
            return this;
        }

        public Builder archived(boolean archived) {
            this.archived = archived;
            return this;
        }

        public Builder professeur(Utilisateur professeur) {
            this.professeur = professeur;
            return this;
        }

        public Builder classe(Classe classe) {
            this.classe = classe;
            return this;
        }

        public Builder fichiers(Set<Fichier> fichiers) {
            this.fichiers = fichiers;
            return this;
        }

        public Exercice build() {
            Exercice exercice = new Exercice();
            exercice.setId(this.id);
            exercice.setTitre(this.titre);
            exercice.setDescription(this.description);
            exercice.setDatePub(this.datePub);
            exercice.setDateLimite(this.dateLimite);
            exercice.setArchived(this.archived);
            exercice.setProfesseur(this.professeur);
            exercice.setClasse(this.classe);
            exercice.setFichiers(this.fichiers);
            return exercice;
        }
    }
}