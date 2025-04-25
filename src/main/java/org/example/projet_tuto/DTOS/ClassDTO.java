package org.example.projet_tuto.DTOS;


import java.util.Objects;

public class ClassDTO {
    private Long id;
    private String name;
    private Long professorId;

    public ClassDTO() {
    }

    private ClassDTO(Long id, String name, Long professorId) {
        this.id = id;
        this.name = name;
        this.professorId = professorId;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getProfessorId() {
        return professorId;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setProfessorName(Long professorName) {
        this.professorId = professorName;
    }

    // equals()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ClassDTO classDTO = (ClassDTO) o;
        return Objects.equals(id, classDTO.id) &&
                Objects.equals(name, classDTO.name) &&
                Objects.equals(professorId, classDTO.professorId);
    }

    // hashCode()
    @Override
    public int hashCode() {
        return Objects.hash(id, name, professorId);
    }

    // toString()
    @Override
    public String toString() {
        return "ClassDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", professorName='" + professorId + '\'' +
                '}';
    }

    // Builder pattern manuel
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private Long professorId;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder professorId(Long professorId) {
            this.professorId = professorId;
            return this;
        }

        public ClassDTO build() {
            return new ClassDTO(id, name, professorId);
        }
    }
}
