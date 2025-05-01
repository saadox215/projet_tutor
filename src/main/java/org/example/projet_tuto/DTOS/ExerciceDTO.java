package org.example.projet_tuto.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class ExerciceDTO {
    private Long id;
    private String titre;
    private String description;
    private LocalDateTime datePub;
    private LocalDateTime dateLimite;
    private boolean archived;

    private Long professeurId;
    private String professeurNom;

    private Long classeId;
    private String classeNom;

    private List<FichierDTO> fichiers;

    public ExerciceDTO(Long id, String titre, String description, LocalDateTime datePub, LocalDateTime dateLimite, boolean archived, Long professeurId, String professeurNom, Long classeId, String classeNom, List<FichierDTO> fichiers) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.datePub = datePub;
        this.dateLimite = dateLimite;
        this.archived = archived;
        this.professeurId = professeurId;
        this.professeurNom = professeurNom;
        this.classeId = classeId;
        this.classeNom = classeNom;
        this.fichiers = fichiers;
    }

    public ExerciceDTO() {
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

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public LocalDateTime getDateLimite() {
        return dateLimite;
    }

    public void setDateLimite(LocalDateTime dateLimite) {
        this.dateLimite = dateLimite;
    }

    public Long getProfesseurId() {
        return professeurId;
    }

    public void setProfesseurId(Long professeurId) {
        this.professeurId = professeurId;
    }

    public String getProfesseurNom() {
        return professeurNom;
    }

    public void setProfesseurNom(String professeurNom) {
        this.professeurNom = professeurNom;
    }

    public Long getClasseId() {
        return classeId;
    }

    public void setClasseId(Long classeId) {
        this.classeId = classeId;
    }

    public String getClasseNom() {
        return classeNom;
    }

    public void setClasseNom(String classeNom) {
        this.classeNom = classeNom;
    }

    public List<FichierDTO> getFichiers() {
        return fichiers;
    }

    public void setFichiers(List<FichierDTO> fichiers) {
        this.fichiers = fichiers;
    }
}
