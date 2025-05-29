package org.example.projet_tuto.Controllers;

import jakarta.persistence.EntityNotFoundException;
import org.example.projet_tuto.DTOS.SoumissionDTO;
import org.example.projet_tuto.Repository.ClasseRepository;
import org.example.projet_tuto.Repository.ExerciceRepository;
import org.example.projet_tuto.Repository.SoumissionRepository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.Service.StudentAssignmentService;
import org.example.projet_tuto.entities.Exercice;
import org.example.projet_tuto.entities.Soumission;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/etudiant")
public class SoumissionController {
    private final StudentAssignmentService studentAssignmentService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UtilisateurRepository utilisateurRepository;
    private final ExerciceRepository exerciceRepository;
    private final ClasseRepository classeRepository;
    private final SoumissionRepository soumissionRepository;

    public SoumissionController(StudentAssignmentService studentAssignmentService, JwtTokenProvider jwtTokenProvider, UtilisateurRepository utilisateurRepository, ExerciceRepository exerciceRepository, ClasseRepository classeRepository, SoumissionRepository soumissionRepository) {
        this.studentAssignmentService = studentAssignmentService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.utilisateurRepository = utilisateurRepository;
        this.exerciceRepository = exerciceRepository;
        this.classeRepository = classeRepository;
        this.soumissionRepository = soumissionRepository;
    }
    // ==================== STUDENT ASSIGNMENTS ====================
    @GetMapping("/soumissions")
    public ResponseEntity<?> getStudentAssignments(@RequestHeader("Authorization") String authHeader) {
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
        List<SoumissionDTO> soumissions = studentAssignmentService.getStudentAssignments(student.getId());
        return ResponseEntity.ok(soumissions);
    }
    @PostMapping("/soumission/{exerciceId}")
    public ResponseEntity<?> addAssignment(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long exerciceId) {
        try {
            String jwt = authHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getUsernameFromJWT(jwt);
            Utilisateur student = utilisateurRepository.findByEmail(email);

            Soumission soumission = studentAssignmentService.addAssignment(student.getId(), exerciceId);
            return ResponseEntity.ok(new SoumissionDTO(
                    soumission.getId(),
                    soumission.getDateSoumission(),
                    soumission.getNote(),
                    soumission.getExercice().getId(),
                    soumission.getExercice().getTitre(),
                    soumission.getExercice().getDescription(),
                    Collections.emptyList() // Or include files if needed
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding assignment: " + e.getMessage());
        }
    }
    @PostMapping("/soumission/{exerciceId}/fichiers")
    public ResponseEntity<?> addFilesToAssignment(@RequestHeader("Authorization") String authHeader, @RequestParam("soumissionId") Long soumissionId, @RequestParam("file") MultipartFile file) {
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
        try {
            studentAssignmentService.uploadFileForAssignment(file, soumissionId, student.getId());
            return ResponseEntity.ok("Files uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @DeleteMapping("/soumission/{soumissionId}/file")
    public ResponseEntity<?> deleteFileFromAssignment(@RequestHeader("Authorization") String authHeader, @PathVariable Long soumissionId) {
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
        try {
            studentAssignmentService.deleteFile(soumissionId);
            return ResponseEntity.ok("File deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
