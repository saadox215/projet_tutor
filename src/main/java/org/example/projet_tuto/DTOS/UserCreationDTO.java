package org.example.projet_tuto.DTOS;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class UserCreationDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String prenom;

    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;

    @NotBlank
    private String role;

    @NotBlank
    private Long classId;
    @NotBlank
    private List<Long> classIds;

    public UserCreationDTO(String name,String prenom, String role, String email, String password, Long classId, List<Long> classIds) {
        this.name = name;
        this.role = role;
        this.email = email;
        this.password = password;
        this.prenom = prenom;
        this.classId = classId;
        this.classIds = classIds;
    }
    public UserCreationDTO() {
    }

    public @NotBlank String getPrenom() {
        return prenom;
    }

    public void setPrenom(@NotBlank String prenom) {
        this.prenom = prenom;
    }

    public @NotBlank String getPassword() {
        return password;
    }

    public @NotBlank Long getClassId() {
        return classId;
    }

    public void setClassId(@NotBlank Long classId) {
        this.classId = classId;
    }

    public @NotBlank List<Long> getClassIds() {
        return classIds;
    }

    public void setClassIds(@NotBlank List<Long> classIds) {
        this.classIds = classIds;
    }

    public void setPassword(@NotBlank String password) {
        this.password = password;
    }

    public @NotBlank String getName() {
        return name;
    }

    public void setName(@NotBlank String name) {
        this.name = name;
    }

    public @Email @NotBlank String getEmail() {
        return email;
    }

    public void setEmail(@Email @NotBlank String email) {
        this.email = email;
    }

    public @NotBlank String getRole() {
        return role;
    }

    public void setRole(@NotBlank String role) {
        this.role = role;
    }
}
