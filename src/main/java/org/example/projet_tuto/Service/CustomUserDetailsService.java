package org.example.projet_tuto.Service;

import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.security.UserPrincipal;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    public CustomUserDetailsService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("Tentative d'authentification pour: " + email);
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email);

        return UserPrincipal.create(utilisateur);
    }
}
