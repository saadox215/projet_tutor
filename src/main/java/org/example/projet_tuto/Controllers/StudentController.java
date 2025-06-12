package org.example.projet_tuto.Controllers;

import org.example.projet_tuto.DTOS.AnnonceDTO;
import org.example.projet_tuto.DTOS.ExerciceDTO;
import org.example.projet_tuto.DTOS.QCMDTO;
import org.example.projet_tuto.Repository.ExerciceRepository;
import org.example.projet_tuto.Repository.SoumissionRepository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.Service.AnnonceStudentService;
import org.example.projet_tuto.Service.StudentqcmService;
import org.example.projet_tuto.entities.Exercice;
import org.example.projet_tuto.entities.Soumission;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/etudiant")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {
    private final AnnonceStudentService annonceStudentService;
    private final UtilisateurRepository utilisateurRepository;
    private final StudentqcmService studentqcmService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    public StudentController(AnnonceStudentService annonceStudentService, UtilisateurRepository utilisateurRepository, StudentqcmService studentqcmService) {
        this.annonceStudentService = annonceStudentService;
        this.utilisateurRepository = utilisateurRepository;
        this.studentqcmService = studentqcmService;
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
    @GetMapping("/qcms")
    public ResponseEntity<?> getStudentQCMs(@RequestHeader("Authorization") String authHeader) {
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
        Set<QCMDTO> qcms = studentqcmService.getQcmByStudent(student.getId());
        return ResponseEntity.ok(qcms);
    }

    // ============ ETUDIANT : SOUMISSIONS ============

    @Autowired
    private SoumissionRepository soumissionRepository;

    @Autowired
    private ExerciceRepository exerciceRepository;

    /**
     * Créer une nouvelle soumission pour un exercice donné
     */
    @PostMapping("/soumission/{exerciceId}")
    public ResponseEntity<?> creerSoumission(@RequestHeader("Authorization") String authHeader,
                                             @PathVariable Long exerciceId) {
        String email = extractEmail(authHeader);
        if (email == null) return unauthorized();

        Utilisateur etudiant = utilisateurRepository.findByEmail(email);
        Optional<Exercice> exercice = exerciceRepository.findById(exerciceId);

        if (etudiant == null || exercice.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Étudiant ou exercice introuvable");
        }

        Soumission soumission = new Soumission();
        soumission.setDateSoumission(new Date());
        soumission.setNote(0);
        soumission.setEtudiant(etudiant);
        soumission.setExercice(exercice.get());

        return ResponseEntity.ok(soumissionRepository.save(soumission));
    }

    /**
     * Liste toutes les soumissions faites par l’étudiant connecté
     */
    @GetMapping("/soumissions")
    public ResponseEntity<?> getSoumissions(@RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        if (email == null) return unauthorized();

        Utilisateur etudiant = utilisateurRepository.findByEmail(email);
        if (etudiant == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Étudiant introuvable");

        return ResponseEntity.ok(soumissionRepository.findByEtudiant(etudiant));
    }


    private String extractEmail(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(token)) return null;
        return jwtTokenProvider.getUsernameFromJWT(token);
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }



}
