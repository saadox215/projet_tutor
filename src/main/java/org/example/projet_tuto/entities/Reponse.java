package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
public class Reponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contenu;
    private boolean correcte; // true si c'est la bonne réponse

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    public Reponse(Long id, String contenu, boolean correcte, Question question) {
        this.id = id;
        this.contenu = contenu;
        this.correcte = correcte;
        this.question = question;
    }
    public Reponse() {
    }

    @Override
    public String toString() {
        return "Reponse{" +
                "correcte=" + correcte +
                ", contenu='" + contenu + '\'' +
                ", id=" + id +
                '}';
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public boolean isCorrecte() {
        return correcte;
    }

    public void setCorrecte(boolean correcte) {
        this.correcte = correcte;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }
}

