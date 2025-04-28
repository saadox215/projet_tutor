package org.example.projet_tuto.DTOS;


import java.util.Date;

public class AnnonceDTO {
    private Long id;
    private String titre;
    private String description;
    private String contenu;
    private Date datePublication;
    private Long professeurId; // Include professeur ID instead of the full Utilisateur object
    private String professeurEmail; // Optionally include email for convenience
    private Long classeId; // Include classe ID instead of the full Classe object
    private String classeNom; // Optionally include class name for convenience

    // Constructor
    public AnnonceDTO(Long id, String titre, String description, String contenu, Date datePublication,
                      Long professeurId, String professeurEmail, Long classeId, String classeNom) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.contenu = contenu;
        this.datePublication = datePublication;
        this.professeurId = professeurId;
        this.professeurEmail = professeurEmail;
        this.classeId = classeId;
        this.classeNom = classeNom;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public String getClasseNom() {
        return classeNom;
    }

    public void setClasseNom(String classeNom) {
        this.classeNom = classeNom;
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

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public Date getDatePublication() {
        return datePublication;
    }

    public void setDatePublication(Date datePublication) {
        this.datePublication = datePublication;
    }

    public Long getProfesseurId() {
        return professeurId;
    }

    public void setProfesseurId(Long professeurId) {
        this.professeurId = professeurId;
    }

    public String getProfesseurEmail() {
        return professeurEmail;
    }

    public void setProfesseurEmail(String professeurEmail) {
        this.professeurEmail = professeurEmail;
    }

    public Long getClasseId() {
        return classeId;
    }

    public void setClasseId(Long classeId) {
        this.classeId = classeId;
    }
}
