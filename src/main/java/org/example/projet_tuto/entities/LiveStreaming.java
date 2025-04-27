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
}

