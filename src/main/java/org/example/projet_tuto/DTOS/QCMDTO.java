package org.example.projet_tuto.DTOS;

import org.example.projet_tuto.entities.Question;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

public class QCMDTO {
    private Long id;
    private String titre;
    private Date dateCreation;
    private Long idClasse;
    private String nomClasse;
    private Set<QuestionDTO> questions;
    private String nomProfesseur;

    public QCMDTO(Long id, String titre, Date dateCreation,Long idClasse, String nomClasse, Set<QuestionDTO> questions, String nomProfesseur) {
        this.id = id;
        this.titre = titre;
        this.dateCreation = dateCreation;
        this.idClasse = idClasse;
        this.nomClasse = nomClasse;
        this.questions = questions;
        this.nomProfesseur = nomProfesseur;

    }
    public QCMDTO(Long id, String titre, Date dateCreation,String nomClasse, String nomProfesseur, Set<QuestionDTO> questions) {
        this.id = id;
        this.titre = titre;
        this.dateCreation = dateCreation;
        this.nomClasse = nomClasse;
        this.questions = questions;
        this.nomProfesseur = nomProfesseur;
    }
    public QCMDTO() {
    }

    public String getNomClasse() {
        return nomClasse;
    }

    public void setNomClasse(String nomClasse) {
        this.nomClasse = nomClasse;
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

    public Date getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Long getIdClasse() {
        return idClasse;
    }

    public void setIdClasse(Long idClasse) {
        this.idClasse = idClasse;
    }

    public Set<QuestionDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(Set<QuestionDTO> questions) {
        this.questions = questions;
    }

    public String getNomProfesseur() {
        return nomProfesseur;
    }

    public void setNomProfesseur(String nomProfesseur) {
        this.nomProfesseur = nomProfesseur;
    }
}
