package org.example.projet_tuto.Controllers;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.example.projet_tuto.DTOS.AnnonceDTO;
import org.example.projet_tuto.Service.EmailService;
import org.example.projet_tuto.Service.ProfesseurService;
import org.example.projet_tuto.entities.Annonce;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prof/annonces")
@CrossOrigin(origins = "*")
public class AnnonceController {

    private final ProfesseurService professeurService;
    private final UtilisateurRepository utilisateurRepository;
    private final ServerProperties serverProperties;
    private  final EmailService emailService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    public AnnonceController(ProfesseurService professeurService, UtilisateurRepository utilisateurRepository, ServerProperties serverProperties, EmailService emailService) {
        this.professeurService = professeurService;
        this.utilisateurRepository = utilisateurRepository;
        this.serverProperties = serverProperties;
        this.emailService = emailService;
    }

    // Get all announcements
    @GetMapping
    public ResponseEntity<List<AnnonceDTO>> getAllAnnonces() {
        return ResponseEntity.ok(professeurService.getAllAnnonces());
    }

    // Get announcement by ID
    @GetMapping("/{id}")
    public ResponseEntity<AnnonceDTO> getAnnonceById(@PathVariable Long id) {
        AnnonceDTO annonce = professeurService.getAnnonceById(id);
        if (annonce != null) {
            return ResponseEntity.ok(annonce);
        }
        return ResponseEntity.notFound().build();
    }

    // Get announcements by professor ID
    @GetMapping("/professeur/{id}")
    public ResponseEntity<List<AnnonceDTO>> getAnnoncesByProfesseur(@PathVariable Long id) {
        return ResponseEntity.ok(professeurService.getAnnoncesByProfId(id));
    }

    // Get announcements by class ID
    @GetMapping("/classe/{id}")
    public ResponseEntity<List<AnnonceDTO>> getAnnoncesByClasse(@PathVariable Long id) {
        return ResponseEntity.ok(professeurService.getAnnoncesByClasseId(id));
    }


    @GetMapping("/professeur/email")
    public ResponseEntity<?> getAnnoncesByProfesseurEmail(@RequestHeader("Authorization") String authHeader) {
        try {
            // Validate Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
            }

            // Extract token
            String token = authHeader.replace("Bearer ", "");

            // Validate token
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            // Extract email
            String email = jwtTokenProvider.getUsernameFromJWT(token);
            System.out.println("Extracted email: " + email);

            Utilisateur professeur = utilisateurRepository.findByEmail(email);
            System.out.println("Professeur: " + professeur.getId());
            if (professeur == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            return ResponseEntity.ok(professeurService.getAnnoncesByProfId(professeur.getId()));
        } catch (JwtException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    // Get classes by professor email (from token)
    @GetMapping("/professeur/classes")
    public ResponseEntity<?> getClassesByProfesseurEmail(@RequestHeader("Authorization") String authHeader) {
        try {
            // Validate Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
            }

            // Extract token
            String token = authHeader.replace("Bearer ", "");

            // Validate token
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            // Extract email
            String email = jwtTokenProvider.getUsernameFromJWT(token);
            System.out.println("Extracted email: " + email);

            Utilisateur professeur = utilisateurRepository.findByEmail(email);
            System.out.println("Professeur: " + professeur.getId());
            if (professeur == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            return ResponseEntity.ok(professeurService.getClassesByProfesseurId(professeur.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    // Create a new announcement
    @PostMapping
    public ResponseEntity<?> createAnnonce(@RequestBody Annonce annonce,
                                           @RequestParam Long classeId,
                                           @RequestHeader("Authorization") String authHeader) {
        try {
            // Validate Authorization header
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
            if (annonce.getDatePublication() == null) {
                annonce.setDatePublication(new Date());
            }

            professeurService.createAnnonces(annonce, professeur.getId(), classeId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Announcement created successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating announcement: " + e.getMessage());
        }
    }

    // Update an announcement
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnnonce(@PathVariable Long id,
                                           @RequestBody Annonce updatedAnnonce,
                                           @RequestHeader("Authorization") String authHeader) {
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
            AnnonceDTO existingAnnonce = professeurService.getAnnonceById(id);

            if (existingAnnonce == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if the announcement belongs to the professor
            if (!existingAnnonce.getProfesseurId().equals(professeur.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to update this announcement");
            }

            AnnonceDTO updated = professeurService.updateAnnonce(id, updatedAnnonce);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating announcement: " + e.getMessage());
        }
    }

    // Delete an announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnonce(@PathVariable Long id,
                                           @RequestHeader("Authorization") String authHeader) {
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

            AnnonceDTO existingAnnonce = professeurService.getAnnonceById(id);

            if (existingAnnonce == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if the announcement belongs to the professor
            if (!existingAnnonce.getProfesseurId().equals(professeur.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to delete this announcement");
            }

            professeurService.deleteAnnonce(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Announcement deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error deleting announcement: " + e.getMessage());
        }
    }


    public String extractEmailFromToken(String token) {
        try {
            if (jwtTokenProvider.validateToken(token)) {
                String email = jwtTokenProvider.getUsernameFromJWT(token);
                System.out.println("Extracted email: " + email);
                return email;
            } else {
                throw new RuntimeException("Invalid or expired JWT token");
            }
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

}