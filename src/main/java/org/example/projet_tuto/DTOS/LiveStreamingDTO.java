package org.example.projet_tuto.DTOS;

import org.example.projet_tuto.entities.LiveStreaming;

import java.util.Date;

public class LiveStreamingDTO {
    public String sujet;
    public Date dateCreation;

    public LiveStreamingDTO(String sujet, Date dateCreation) {
        this.sujet = sujet;
        this.dateCreation = dateCreation;
    }
    public LiveStreaming toLiveStreaming() {
        LiveStreaming liveStreaming = new LiveStreaming();
        liveStreaming.setSujet(sujet);
        liveStreaming.setDateCreation(dateCreation);
        return liveStreaming;
    }
}
