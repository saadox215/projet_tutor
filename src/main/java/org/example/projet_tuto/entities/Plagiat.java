package org.example.projet_tuto.entities;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Plagiat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private float scorePlagiat;

    @OneToOne
    @JoinColumn(name = "soumission_id")
    private Soumission soumission;

    public void setScorePlagiat(float scorePlagiat) {
        this.scorePlagiat = scorePlagiat;
    }

    public void setSoumission(Soumission soumission) {
        this.soumission = soumission;
    }

}

