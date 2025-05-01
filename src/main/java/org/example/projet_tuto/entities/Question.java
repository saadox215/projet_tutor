package org.example.projet_tuto.entities;

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
    private boolean correct=false;

    @ManyToOne
    @JoinColumn(name = "qcm_id")
    private QCM qcm;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private Set<Reponse> reponses;
}


