package org.example.projet_tuto.DTOS;


import org.example.projet_tuto.entities.Fichier;

import java.time.LocalDateTime;


public class FichierDTO {
    private Long id;
    private String nom;
    private String url;
    private String contentType;
    private Long taille;
    private LocalDateTime dateUpload;

    public FichierDTO(Long id, String nom, String url, String contentType, Long taille, LocalDateTime dateUpload) {
        this.id = id;
        this.nom = nom;
        this.url = url;
        this.contentType = contentType;
        this.taille = taille;
        this.dateUpload = dateUpload;
    }

    public FichierDTO() {
    }

    public FichierDTO(Fichier fichier) {
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

    public Long getTaille() {
        return taille;
    }

    public void setTaille(Long taille) {
        this.taille = taille;
    }

    public LocalDateTime getDateUpload() {
        return dateUpload;
    }

    public void setDateUpload(LocalDateTime dateUpload) {
        this.dateUpload = dateUpload;
    }
}
