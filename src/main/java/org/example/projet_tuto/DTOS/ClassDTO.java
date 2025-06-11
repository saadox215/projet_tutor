package org.example.projet_tuto.DTOS;


import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Objects;

public class ClassDTO {
    private Long id;
    private String name;
    private List<Long> professorIds;
    private List<String> professorNames; // Added for professor's full name
    private List<UserDTO> students;
    private int studentCount; // Added for the number of assigned students

    public ClassDTO() {
    }

    @JsonProperty("professorIds")
    public List<Long> getProfessorIds() {
        return professorIds;
    }

    @JsonProperty("professorIds")
    public void setProfessorIds(List<Long> professorIds) {
        this.professorIds = professorIds;
    }

    private ClassDTO(Long id, String name,List<Long> professorIds , List<String> professorName, List<UserDTO> students, int studentCount) {
        this.id = id;
        this.name = name;
        this.professorNames = professorName;
        this.students = students;
        this.professorIds = professorIds;
        this.studentCount = studentCount;
    }

    // Getters
    public Long getId() {
        return id;
    }


    public List<String> getProfessorName() {
        return professorNames;
    }

    public void setProfessorName(List<String> professorName) {
        this.professorNames = professorName;
    }

    public List<UserDTO> getStudents() {
        return students;
    }

    public void setStudents(List<UserDTO> students) {
        this.students = students;
    }

    public int getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
    }

    public String getName() {
        return name;
    }


    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getProfessorNames() {
        return professorNames;
    }

    public void setProfessorNames(List<String> professorNames) {
        this.professorNames = professorNames;
    }

    // equals()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ClassDTO classDTO = (ClassDTO) o;
        return Objects.equals(id, classDTO.id) &&
                Objects.equals(name, classDTO.name) &&
                Objects.equals(professorIds, classDTO.professorIds) &&
                Objects.equals(professorNames, classDTO.professorNames) &&
                Objects.equals(students, classDTO.students) &&
                Objects.equals(studentCount, classDTO.studentCount);
    }

    // hashCode()
    @Override
    public int hashCode() {
        return Objects.hash(id, name,professorNames, students, studentCount);
    }

    // toString()
    @Override
    public String toString() {
        return "ClassDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", students=" + students +
                ", studentCount=" + studentCount +
                '}';
    }

    // Builder pattern manuel
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private List<Long> professorIds;
        private List<String> professorNames;
        private List<UserDTO> students;
        private int studentCount;
        private Builder() {
        }
        public Builder professorName(List<String> professorNames) {
            this.professorNames = professorNames;
            return this;
        }
        public Builder professorIds(List<Long> professorIds) {
            this.professorIds = professorIds;
            return this;
        }
        public Builder students(List<UserDTO> students) {
            this.students = students;
            return this;
        }
        public Builder studentCount(int studentCount) {
            this.studentCount = studentCount;
            return this;
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }


        public ClassDTO build() {
            return new ClassDTO(id, name,professorIds, professorNames, students, studentCount);
        }


    }
}
