package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class LiveStreaming {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sujet;
    private Date dateCreation;
    private String meetingURL;
    private Long zoomMeetingId;

    @ManyToOne
    @JoinColumn(name = "professeur_id")
    private Utilisateur professeur;
    @ManyToOne
    private Classe classe;

    public Classe getClasse() {
        return classe;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
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

    public void setSujet(String sujet) {
        this.sujet = sujet;
    }

    public Date getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getMeetingURL() {
        return meetingURL;
    }

    public void setMeetingURL(String meetingURL) {
        this.meetingURL = meetingURL;
    }

    public Long getZoomMeetingId() {
        return zoomMeetingId;
    }

    public void setZoomMeetingId(Long zoomMeetingId) {
        this.zoomMeetingId = zoomMeetingId;
    }

    public Utilisateur getProfesseur() {
        return professeur;
    }

    public void setProfesseur(Utilisateur professeur) {
        this.professeur = professeur;
    }
}

