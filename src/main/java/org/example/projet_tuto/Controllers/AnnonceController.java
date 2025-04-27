package org.example.projet_tuto.controller;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.example.projet_tuto.Service.ProfesseurService;
import org.example.projet_tuto.entities.Annonce;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
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

    @Autowired
    public AnnonceController(ProfesseurService professeurService, UtilisateurRepository utilisateurRepository, ServerProperties serverProperties) {
        this.professeurService = professeurService;
        this.utilisateurRepository = utilisateurRepository;
        this.serverProperties = serverProperties;
    }

    // Get all announcements
    @GetMapping
    public ResponseEntity<List<Annonce>> getAllAnnonces() {
        return ResponseEntity.ok(professeurService.getAllAnnonces());
    }

    // Get announcement by ID
    @GetMapping("/{id}")
    public ResponseEntity<Annonce> getAnnonceById(@PathVariable Long id) {
        Annonce annonce = professeurService.getAnnonceById(id);
        if (annonce != null) {
            return ResponseEntity.ok(annonce);
        }
        return ResponseEntity.notFound().build();
    }

    // Get announcements by professor ID
    @GetMapping("/professeur/{id}")
    public ResponseEntity<List<Annonce>> getAnnoncesByProfesseur(@PathVariable Long id) {
        return ResponseEntity.ok(professeurService.getAnnoncesByProfId(id));
    }

    // Get announcements by class ID
    @GetMapping("/classe/{id}")
    public ResponseEntity<List<Annonce>> getAnnoncesByClasse(@PathVariable Long id) {
        return ResponseEntity.ok(professeurService.getAnnoncesByClasseId(id));
    }


    // Get announcements by professor email (from token)
    @GetMapping("/professeur/email")
    public ResponseEntity<?> getAnnoncesByProfesseurEmail(@RequestHeader("Authorization") String token) {
        try {
            // Extract email from token (simplified - in real app use proper JWT extraction)
            String email = extractEmailFromToken(token);
            Utilisateur professeur = utilisateurRepository.findByEmail(email);

            if (professeur == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            return ResponseEntity.ok(professeurService.getAnnoncesByProfId(professeur.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    // Get classes by professor email (from token)
    @GetMapping("/professeur/classes")
    public ResponseEntity<?> getClassesByProfesseurEmail(@RequestHeader("Authorization") String token) {
        try {
            String email = extractEmailFromToken(token);
            Utilisateur professeur = utilisateurRepository.findByEmail(email);

            if (professeur == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            return ResponseEntity.ok(professeurService.getClassesByProfId(professeur.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    // Create a new announcement
    @PostMapping
    public ResponseEntity<?> createAnnonce(@RequestBody Annonce annonce,
                                           @RequestParam Long classeId,
                                           @RequestHeader("Authorization") String token) {
        try {
            String email = extractEmailFromToken(token);
            Utilisateur professeur = utilisateurRepository.findByEmail(email);

            if (professeur == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // Set current date if not provided
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
                                           @RequestHeader("Authorization") String token) {
        try {
            String email = extractEmailFromToken(token);
            Utilisateur professeur = utilisateurRepository.findByEmail(email);

            if (professeur == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            Annonce existingAnnonce = professeurService.getAnnonceById(id);

            if (existingAnnonce == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if the announcement belongs to the professor
            if (!existingAnnonce.getProfesseur().getId().equals(professeur.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to update this announcement");
            }

            Annonce updated = professeurService.updateAnnonce(id, updatedAnnonce);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating announcement: " + e.getMessage());
        }
    }

    // Delete an announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnonce(@PathVariable Long id,
                                           @RequestHeader("Authorization") String token) {
        try {
            String email = extractEmailFromToken(token);
            System.out.printf(email);
            Utilisateur professeur = utilisateurRepository.findByEmail(email);

            if (professeur == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            Annonce existingAnnonce = professeurService.getAnnonceById(id);

            if (existingAnnonce == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if the announcement belongs to the professor
            if (!existingAnnonce.getProfesseur().getId().equals(professeur.getId())) {
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

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    private String extractEmailFromToken(String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            if (token == null || token.trim().isEmpty()) {
                throw new JwtException("Token is empty or null");
            }
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtSecret.getBytes(StandardCharsets.UTF_8))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            String email = claims.get("email", String.class);
            if (email == null) {
                throw new JwtException("Email claim not found in token");
            }
            return email;
        } catch (JwtException e) {
            throw new RuntimeException("Invalid token: " + e.getMessage(), e);
        }
    }
}