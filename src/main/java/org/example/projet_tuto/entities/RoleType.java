package org.example.projet_tuto.entities;

import jakarta.persistence.Enumerated;


public enum RoleType {
    ADMIN("ROLE_ADMIN"),
    PROFESSEUR("ROLE_PROFESSEUR"),
    ETUDIANT("ROLE_ETUDIANT");

    private final String roleName;

    RoleType(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }

    public static RoleType fromString(String text) {
        for (RoleType role : RoleType.values()) {
            if (role.roleName.equalsIgnoreCase(text)) {
                return role;
            }
        }
        throw new IllegalArgumentException("No constant with text " + text + " found");
    }
}
