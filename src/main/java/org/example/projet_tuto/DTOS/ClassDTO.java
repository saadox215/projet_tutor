package org.example.projet_tuto.DTOS;


import java.util.List;
import java.util.Objects;

public class ClassDTO {
    private Long id;
    private String name;
    private Long professorId;
    private String professorName; // Added for professor's full name
    private List<UserDTO> students;
    private int studentCount; // Added for the number of assigned students

    public ClassDTO() {
    }

    private ClassDTO(Long id, String name, Long professorId, String professorName, List<UserDTO> students, int studentCount) {
        this.id = id;
        this.name = name;
        this.professorId = professorId;
        this.professorName = professorName;
        this.students = students;
        this.studentCount = studentCount;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public void setProfessorId(Long professorId) {
        this.professorId = professorId;
    }

    public String getProfessorName() {
        return professorName;
    }

    public void setProfessorName(String professorName) {
        this.professorName = professorName;
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
                Objects.equals(professorId, classDTO.professorId) &&
                Objects.equals(professorName, classDTO.professorName) &&
                Objects.equals(students, classDTO.students) &&
                Objects.equals(studentCount, classDTO.studentCount);
    }

    // hashCode()
    @Override
    public int hashCode() {
        return Objects.hash(id, name, professorId, professorName, students, studentCount);
    }

    // toString()
    @Override
    public String toString() {
        return "ClassDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", professorName='" + professorId + '\'' +
                ", students=" + students +
                ", studentCount=" + studentCount +
                ", professorId=" + professorId +
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
        private String professorName;
        private List<UserDTO> students;
        private int studentCount;
        private Builder() {
        }
        public Builder professorName(String professorName) {
            this.professorName = professorName;
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

        public Builder professorId(Long professorId) {
            this.professorId = professorId;
            return this;
        }

        public ClassDTO build() {
            return new ClassDTO(id, name, professorId, professorName, students, studentCount);
        }
    }
}
