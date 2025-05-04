package org.example.projet_tuto.Controllers;

import org.example.projet_tuto.DTOS.UserDTO;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.Service.EmailService;
import org.example.projet_tuto.Service.ProfileService;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/prof/profile")
@CrossOrigin(origins = "*")
public class ProfileController {
    private final ProfileService profileService;
    private final UtilisateurRepository utilisateurRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    public ProfileController(ProfileService profileService, EmailService emailService,
                             UtilisateurRepository utilisateurRepository) {
        this.profileService = profileService;
        this.utilisateurRepository = utilisateurRepository;
    }
    @GetMapping("/get")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
            }

            String token = authHeader.replace("Bearer ", "");

            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            String email = jwtTokenProvider.getUsernameFromJWT(token);
            System.out.println("Extracted email: " + email);

            Utilisateur professeur = utilisateurRepository.findByEmail(email);
            if (professeur == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            UserDTO response = profileService.getUserProfile(professeur.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating announcement: " + e.getMessage());
        }
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateUserProfile(@RequestHeader("Authorization") String authHeader,
                                                @RequestBody UserDTO userDTO) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
            }

            String token = authHeader.replace("Bearer ", "");

            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            String email = jwtTokenProvider.getUsernameFromJWT(token);
            System.out.println("Extracted email: " + email);

            Utilisateur professeur = utilisateurRepository.findByEmail(email);
            if (professeur == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            profileService.updateUserProfile(professeur.getId(), userDTO);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating profile: " + e.getMessage());
        }
    }
}
