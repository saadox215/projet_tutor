package org.example.projet_tuto.DTOS;

public class ReponseDTO {
    private Long id;
    private String contenu;
    private boolean isCorrecte;
    private Long idQuestion;

    public ReponseDTO(Long id, String contenu, boolean estCorrecte, Long idQuestion) {
        this.id = id;
        this.contenu = contenu;
        this.isCorrecte = estCorrecte;
        this.idQuestion = idQuestion;
    }

    public ReponseDTO(Long id, String contenu, boolean estCorrecte) {
        this.id = id;
        this.contenu = contenu;
        this.isCorrecte = estCorrecte;
    }

    public ReponseDTO() {
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
        return isCorrecte;
    }

    public void setCorrecte(boolean correcte) {
        isCorrecte = correcte;
    }

    public Long getIdQuestion() {
        return idQuestion;
    }

    public void setIdQuestion(Long idQuestion) {
        this.idQuestion = idQuestion;
    }
}
