package org.example.projet_tuto.DTOS;

import java.util.Set;

public class QuestionDTO {
    private Long id;
    private String contenu;
    private int note;
    private Long idQCM;
    String nomProfesseur;
    private Set<ReponseDTO> reponses;

    public QuestionDTO(Long id, String contenu, int note, Set<ReponseDTO> reponses,String nomProfesseur) {
        this.id = id;
        this.contenu = contenu;
        this.note = note;
        this.nomProfesseur = nomProfesseur;
        this.reponses = reponses;
    }

    public QuestionDTO() {
    }

    public Long getId() {
        return id;
    }

    public Set<ReponseDTO> getReponses() {
        return reponses;
    }

    public void setReponses(Set<ReponseDTO> reponses) {
        this.reponses = reponses;
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

    public Long getIdQCM() {
        return idQCM;
    }

    public void setIdQCM(Long idQCM) {
        this.idQCM = idQCM;
    }
}
