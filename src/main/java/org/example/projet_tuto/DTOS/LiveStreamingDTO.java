package org.example.projet_tuto.DTOS;

import org.example.projet_tuto.entities.LiveStreaming;

import java.time.LocalDateTime;
import java.util.Date;

public class LiveStreamingDTO {
    private Long id;
    private String sujet;
    private LocalDateTime dateCreation;
    private String classNom;
    private String joinUrl;

    public LiveStreamingDTO(Long id,String sujet, LocalDateTime dateCreation, String classNom, String joinUrl) {
        this.id = id;
        this.sujet = sujet;
        this.dateCreation = dateCreation;
        this.classNom = classNom;
        this.joinUrl = joinUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSujet() {
        return sujet;
    }

    public String getJoinUrl() {
        return joinUrl;
    }

    public void setJoinUrl(String joinUrl) {
        this.joinUrl = joinUrl;
    }

    public void setSujet(String sujet) {
        this.sujet = sujet;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getClassNom() {
        return classNom;
    }

    public void setClassNom(String classNom) {
        this.classNom = classNom;
    }
}
