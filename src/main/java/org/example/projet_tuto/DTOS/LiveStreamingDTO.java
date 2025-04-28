package org.example.projet_tuto.DTOS;

import org.example.projet_tuto.entities.LiveStreaming;

import java.util.Date;

public class LiveStreamingDTO {
    public String sujet;
    public Date dateCreation;
    public long idProf;
    public long idClasse;


    public LiveStreamingDTO(String sujet, Date dateCreation, long idProf, long idClasse) {
        this.sujet = sujet;
        this.dateCreation = dateCreation;
        this.idProf = idProf;
        this.idClasse = idClasse;
    }
    public LiveStreaming toLiveStreaming() {
        LiveStreaming liveStreaming = new LiveStreaming();
        liveStreaming.setSujet(sujet);
        liveStreaming.setDateCreation(dateCreation);
        liveStreaming.getProfesseur().setId(idProf);
        liveStreaming.getClasse().setId(idClasse);
        return liveStreaming;

    }
}
