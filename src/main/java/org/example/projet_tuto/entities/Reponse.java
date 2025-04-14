package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Reponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contenu;
    private boolean correcte; // true si c'est la bonne réponse

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;
}

