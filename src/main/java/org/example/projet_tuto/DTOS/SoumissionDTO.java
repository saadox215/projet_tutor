package org.example.projet_tuto.DTOS;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public class SoumissionDTO {
    private Long id;
    private LocalDate dateSoumission;
    private float note;
    private Long exerciceId;
    private String exerciceTitre;
    private String exerciceDescription;
    private List<FichierDTO> fichiers;

    public SoumissionDTO(Long id, LocalDate dateSoumission, float note, Long exerciceId, String exerciceTitre, String exerciceDescription, List<FichierDTO> fichiers) {
        this.id = id;
        this.dateSoumission = dateSoumission;
        this.note = note;
        this.exerciceId = exerciceId;
        this.exerciceTitre = exerciceTitre;
        this.exerciceDescription = exerciceDescription;
        this.fichiers = fichiers;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public LocalDate getDateSoumission() {
        return dateSoumission;
    }

    public void setDateSoumission(LocalDate dateSoumission) {
        this.dateSoumission = dateSoumission;
    }

    public float getNote() {
        return note;
    }

    public void setNote(float note) {
        this.note = note;
    }

    public Long getExerciceId() {
        return exerciceId;
    }

    public void setExerciceId(Long exerciceId) {
        this.exerciceId = exerciceId;
    }

    public String getExerciceTitre() {
        return exerciceTitre;
    }

    public void setExerciceTitre(String exerciceTitre) {
        this.exerciceTitre = exerciceTitre;
    }

    public String getExerciceDescription() {
        return exerciceDescription;
    }

    public void setExerciceDescription(String exerciceDescription) {
        this.exerciceDescription = exerciceDescription;
    }

    public List<FichierDTO> getFichiers() {
        return fichiers;
    }

    public void setFichiers(List<FichierDTO> fichiers) {
        this.fichiers = fichiers;
    }
}
