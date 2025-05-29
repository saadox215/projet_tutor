package org.example.projet_tuto.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Arrays;
import java.util.Set;

@Entity
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String prenom;
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
    private boolean actif;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String nom) {
        this.name = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActif() {
        return actif;
    }

    public void setActif(boolean actif) {
        this.actif = actif;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Classe getClasse() {
        return classe;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public Utilisateur(Long id, String nom, String prenom, String email, String password, boolean actif, Set<Role> roles, Classe classe) {
        this.id = id;
        this.name = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.actif = actif;
        this.roles = roles;
        this.classe = classe;
    }

    public Utilisateur() {
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "utilisateur_roles",
            joinColumns = @JoinColumn(name = "utilisateur_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    public Set<LiveStreaming> getLiveStreamings() {
        return liveStreamings;
    }

    public void setLiveStreamings(Set<LiveStreaming> liveStreamings) {
        this.liveStreamings = liveStreamings;
    }

    public Set<Classe> getClassesEnseignees() {
        return classesEnseignees;
    }

    public void setClassesEnseignees(Set<Classe> classesEnseignees) {
        this.classesEnseignees = classesEnseignees;
    }

    public Set<QCM> getQcms() {
        return qcms;
    }

    public void setQcms(Set<QCM> qcms) {
        this.qcms = qcms;
    }

    @ManyToOne
    @JoinColumn(name = "classe_id")
    private Classe classe;

    @ManyToMany(mappedBy = "enseignants",fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<Classe> classesEnseignees;

    @OneToMany(mappedBy = "professeur",fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<LiveStreaming> liveStreamings;

    @OneToMany(mappedBy = "professeur", fetch = FetchType.EAGER)
    private Set<QCM> qcms;

    @ManyToMany
    @JoinTable(
            name = "utilisateur_annonce_vu",
            joinColumns = @JoinColumn(name = "utilisateur_id"),
            inverseJoinColumns = @JoinColumn(name = "annonce_id")
    )
    private Set<Annonce> annoncesVues;

    public Set<Annonce> getAnnoncesVues() {
        return annoncesVues;
    }

    public void setAnnoncesVues(Set<Annonce> annoncesVues) {
        this.annoncesVues = annoncesVues;
    }

    public Set<Soumission> getSoumissions() {
        return soumissions;
    }

    public void setSoumissions(Set<Soumission> soumissions) {
        this.soumissions = soumissions;
    }

    @OneToMany(mappedBy = "etudiant", fetch = FetchType.EAGER)
    private Set<Soumission> soumissions;
}

