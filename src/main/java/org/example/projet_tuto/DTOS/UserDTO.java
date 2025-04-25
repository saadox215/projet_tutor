package org.example.projet_tuto.DTOS;

import java.util.List;
import java.util.Objects;

public class UserDTO {
    private Long id;
    private String name;
    private String prenom;
    private String email;
    private String password;
    private String role;
    private Long classId;
    private List<Long> classIds;

    public UserDTO() {
    }

    // Constructeur pour le builder
    private UserDTO(Long id, String name,String prenom, String email, String role, String password, Long classId, List<Long> classIds) {
        this.id = id;
        this.name = name;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.role = role;
        this.classId = classId;
        this.classIds = classIds;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public List<Long> getClassIds() {
        return classIds;
    }

    public void setClassIds(List<Long> classIds) {
        this.classIds = classIds;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    // equals()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDTO userDTO = (UserDTO) o;
        return Objects.equals(id, userDTO.id) &&
                Objects.equals(name, userDTO.name) &&
                Objects.equals(prenom, userDTO.prenom) &&
                Objects.equals(email, userDTO.email) &&
                Objects.equals(password, userDTO.password) &&
                Objects.equals(classId, userDTO.classId) &&
                Objects.equals(classIds, userDTO.classIds) &&
                Objects.equals(role, userDTO.role);
    }

    // hashCode()
    @Override
    public int hashCode() {
        return Objects.hash(id, name,prenom, password,  email, role, classId, classIds);
    }

    // toString()
    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", prenom='" + prenom + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role='" + role + '\'' +
                ", classId=" + classId +
                ", classIds=" + classIds +
                '}';
    }

    // Builder pattern manuel
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String prenom;
        private String email;
        private String password;
        private String role;
        private Long classId;
        private List<Long> classIds;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }
        public Builder prenom(String prenom) {
            this.prenom = prenom;
            return this;
        }
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        public Builder password(String password) {
            this.password = password;
            return this;
        }
        public Builder role(String role) {
            this.role = role;
            return this;
        }
        public Builder classId(Long classId) {
            this.classId = classId;
            return this;
        }
        public Builder classIds(List<Long> classIds) {
            this.classIds = classIds;
            return this;
        }

        public UserDTO build() {
            return new UserDTO(id, name, prenom, email, role, password, classId, classIds);
        }
    }
}
