package org.example.projet_tuto.Controllers;

import org.example.projet_tuto.DTOS.AnnonceDTO;
import org.example.projet_tuto.DTOS.ExerciceDTO;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.Service.AnnonceStudentService;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etudiant")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {
    private final AnnonceStudentService annonceStudentService;
    private final UtilisateurRepository utilisateurRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    public StudentController(AnnonceStudentService annonceStudentService, UtilisateurRepository utilisateurRepository) {
        this.annonceStudentService = annonceStudentService;
        this.utilisateurRepository = utilisateurRepository;
    }
    // ==================== STUDENT ANNOUNCEMENTS ====================
     @GetMapping("/annonces")
    public ResponseEntity<?> getStudentAnnonces(@RequestHeader("Authorization") String authHeader) {
         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
         }

         String token = authHeader.replace("Bearer ", "");

         if (!jwtTokenProvider.validateToken(token)) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
         }

         String email = jwtTokenProvider.getUsernameFromJWT(token);
         System.out.println("Extracted email: " + email);

         Utilisateur student = utilisateurRepository.findByEmail(email);
         if (student == null) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
         }
        List<AnnonceDTO> annonces = annonceStudentService.getStudentAnnnonce(student.getId());
        return ResponseEntity.ok(annonces);
    }
    @PostMapping("/annonces/{id_annonce}/vu")
    public ResponseEntity<?> markAnnonceAsSeen(@RequestHeader("Authorization") String authHeader, @PathVariable Long id_annonce) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
        }

        String token = authHeader.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String email = jwtTokenProvider.getUsernameFromJWT(token);
        System.out.println("Extracted email: " + email);

        Utilisateur student = utilisateurRepository.findByEmail(email);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        annonceStudentService.markAnnonceAsSeen(student.getId(), id_annonce);
        return ResponseEntity.ok("Annonce marked as seen");
    }
    // Check if the announcement is seen
    @GetMapping("/annonces/{id_annonce}/vu")
    public ResponseEntity<?> isAnnonceSeen(@RequestHeader("Authorization") String authHeader, @PathVariable Long id_annonce) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
        }

        String token = authHeader.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String email = jwtTokenProvider.getUsernameFromJWT(token);
        System.out.println("Extracted email: " + email);

        Utilisateur student = utilisateurRepository.findByEmail(email);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        boolean isSeen = annonceStudentService.isAnnonceSeen(student.getId(), id_annonce);
        return ResponseEntity.ok(isSeen);
    }
    // ==================== STUDENT EXERCISES ====================
    @GetMapping("/exercices")
    public ResponseEntity<?> getStudentExercices(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
        }

        String token = authHeader.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String email = jwtTokenProvider.getUsernameFromJWT(token);
        System.out.println("Extracted email: " + email);

        Utilisateur student = utilisateurRepository.findByEmail(email);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(annonceStudentService.getExercices(student.getId()));
    }

    //====== meetings ======
    @GetMapping("/meetings")
    public ResponseEntity<?> getStudentMeetings(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
        }

        String token = authHeader.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String email = jwtTokenProvider.getUsernameFromJWT(token);
        System.out.println("Extracted email: " + email);

        Utilisateur student = utilisateurRepository.findByEmail(email);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(annonceStudentService.getLiveStreamings(student.getId()));
    }
}
