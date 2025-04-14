package org.example.projet_tuto.DTOS;


import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class LoginResponse {
    private String token;
    private String email;
    private Collection<? extends GrantedAuthority> authorities;

    // Constructeur
    public LoginResponse(String token, String email, Collection<? extends GrantedAuthority> authorities) {
        this.token = token;
        this.email = email;
        this.authorities = authorities;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
}
