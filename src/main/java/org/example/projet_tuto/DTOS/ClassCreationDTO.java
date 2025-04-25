package org.example.projet_tuto.DTOS;


import jakarta.validation.constraints.NotBlank;


public class ClassCreationDTO {
    @NotBlank
    private String name;

    @NotBlank
    private Long professorId;

    public ClassCreationDTO(Long professorId, String name) {
        this.professorId = professorId;
        this.name = name;
    }

    public ClassCreationDTO() {
    }

    public @NotBlank String getName() {
        return name;
    }

    public void setName(@NotBlank String name) {
        this.name = name;
    }

    public @NotBlank Long getProfessorId() {
        return professorId;
    }

    public void setProfessorId(@NotBlank Long professorId) {
        this.professorId = professorId;
    }
}
