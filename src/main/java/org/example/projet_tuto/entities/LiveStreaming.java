package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "live_streaming")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveStreaming {
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank(message = "Subject is mandatory") String getSujet() {
        return sujet;
    }

    public void setSujet(@NotBlank(message = "Subject is mandatory") String sujet) {
        this.sujet = sujet;
    }

    public @NotNull(message = "Start time is mandatory") LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(@NotNull(message = "Start time is mandatory") LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Long getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(Long meetingId) {
        this.meetingId = meetingId;
    }

    public String getJoinUrl() {
        return joinUrl;
    }

    public void setJoinUrl(String joinUrl) {
        this.joinUrl = joinUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Utilisateur getProfesseur() {
        return professeur;
    }

    public void setProfesseur(Utilisateur professeur) {
        this.professeur = professeur;
    }

    public Classe getClasse() {
        return classe;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Subject is mandatory")
    @Column(nullable = false)
    private String sujet;

    @NotNull(message = "Start time is mandatory")
    @Column(name = "start_time", nullable = false)
    private LocalDateTime dateCreation;

    @Column(name = "zoom_meeting_id")
    private Long meetingId;

    @Column(name = "zoom_join_url")
    private String joinUrl;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "professeur_id", referencedColumnName = "id")
    private Utilisateur professeur;

    @ManyToOne
    @JoinColumn(name = "classe_id")
    private Classe classe;

}