package org.example.projet_tuto.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contenu;
    private int note;

    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", contenu='" + contenu + '\'' +
                ", note=" + note +
                ", qcm=" + qcm +
                ", reponses=" + reponses.toString() +
                '}';
    }

    @ManyToOne
    @JoinColumn(name = "qcm_id")
    private QCM qcm;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Reponse> reponses;

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

    public int getNote() {
        return note;
    }

    public void setNote(int note) {
        this.note = note;
    }

    public QCM getQcm() {
        return qcm;
    }

    public void setQcm(QCM qcm) {
        this.qcm = qcm;
    }

    public Set<Reponse> getReponses() {
        return reponses;
    }

    public void setReponses(Set<Reponse> reponses) {
        this.reponses = reponses;
    }
}