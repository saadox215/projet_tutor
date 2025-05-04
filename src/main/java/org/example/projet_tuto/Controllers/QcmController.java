package org.example.projet_tuto.Controllers;

import jakarta.validation.Valid;
import org.example.projet_tuto.Exception.QcmNotFoundException;
import org.example.projet_tuto.Exception.ValidationException;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.Service.QcmService;
import org.example.projet_tuto.entities.QCM;
import org.example.projet_tuto.entities.Question;
import org.example.projet_tuto.entities.Reponse;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController()
@RequestMapping("/api/prof/evaluation")
@CrossOrigin(origins = "*")
public class QcmController {
    private static final Logger log = LoggerFactory.getLogger(QcmController.class);

    private final QcmService qcmService;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public QcmController(QcmService qcmService,
                         UtilisateurRepository utilisateurRepository,
                         JwtTokenProvider jwtTokenProvider) {
        this.qcmService = qcmService;
        this.utilisateurRepository = utilisateurRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    @GetMapping("/qcms")
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<?> getAllQcms(@RequestHeader("Authorization") String authHeader) {
        try {
            log.info("Received request to get all QCMs");

            // Validate Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
            }

            String token = authHeader.replace("Bearer ", "");

            // Validate JWT token
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            // Extract email from token
            String email = jwtTokenProvider.getUsernameFromJWT(token);
            log.info("Extracted email: {}", email);

            // Verify professor
            Utilisateur professeur = utilisateurRepository.findByEmail(email);
            if (professeur == null) {
                log.warn("Utilisateur not found with email: {}", email);
                return new ResponseEntity<>(Map.of("error", "Utilisateur not found"), HttpStatus.BAD_REQUEST);
            }

            // Get all QCMs for the professor
            return new ResponseEntity<>(qcmService.getAllQcms(professeur.getId()), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Failed to get QCMs: {}", e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/create")
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<?> createQcm(@Valid @RequestBody QCM qcm,
                                       @RequestParam Long classeId,
                                       @RequestHeader("Authorization") String authHeader) {
        try {
            log.info("Received request to create QCM with titre: {}", qcm.getTitre());

            // Extract email from token
            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getUsernameFromJWT(token);
            log.info("Extracted email: {}", email);

            // Retrieve professor
            Utilisateur professeur = utilisateurRepository.findByEmail(email);
            if (professeur == null) {
                log.warn("Utilisateur not found with email: {}", email);
                return new ResponseEntity<>(Map.of("error", "Utilisateur not found"), HttpStatus.BAD_REQUEST);
            }

            // Validate QCM input
            if (qcm.getTitre() == null || qcm.getDateCreation() == null ||
                    qcm.getQuestions() == null || qcm.getQuestions().isEmpty()) {
                log.warn("Invalid QCM details: titre={}, dateCreation={}, questions={}",
                        qcm.getTitre(), qcm.getDateCreation(), qcm.getQuestions());
                return new ResponseEntity<>(Map.of("error", "Titre, dateCreation, and at least one question are required"),
                        HttpStatus.BAD_REQUEST);
            }

            // Validate questions and responses
            for (Question question : qcm.getQuestions()) {
                if (question.getContenu() == null || question.getReponses() == null || question.getReponses().isEmpty()) {
                    log.warn("Invalid question: contenu={}, reponses={}", question.getContenu(), question.getReponses());
                    return new ResponseEntity<>(Map.of("error", "Each question must have contenu and at least one response"),
                            HttpStatus.BAD_REQUEST);
                }
                for (Reponse reponse : question.getReponses()) {
                    if (reponse.getContenu() == null) {
                        log.warn("Invalid response: contenu={}", reponse.getContenu());
                        return new ResponseEntity<>(Map.of("error", "Each response must have contenu"),
                                HttpStatus.BAD_REQUEST);
                    }
                }
            }

            // Create QCM
            QCM createdQcm = qcmService.createQCM(qcm, classeId, professeur.getId());
            log.info("Successfully created QCM with ID: {}", createdQcm.getId());

            return new ResponseEntity<>(createdQcm, HttpStatus.CREATED);
        } catch (ValidationException e) {
            log.error("Failed to create QCM: {}", e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Failed to create QCM: {}", e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", "Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/info")
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<?> updateQcm(@Valid @RequestBody QCM qcm,
                                       @RequestParam Long classeId,
                                       @RequestHeader("Authorization") String authHeader) {
        try {
            log.info("Received request to update QCM with ID: {}, titre: {}", qcm.getId(), qcm.getTitre());

            // Validate Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
            }

            String token = authHeader.replace("Bearer ", "");

            // Validate JWT token
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            // Extract email from token
            String email = jwtTokenProvider.getUsernameFromJWT(token);
            log.info("Extracted email: {}", email);

            // Verify professor
            Utilisateur professeur = utilisateurRepository.findByEmail(email);
            if (professeur == null) {
                log.warn("Utilisateur not found with email: {}", email);
                return new ResponseEntity<>(Map.of("error", "Utilisateur not found"), HttpStatus.BAD_REQUEST);
            }

            // Validate QCM input
            if (qcm.getId() == null || qcm.getTitre() == null || qcm.getDateCreation() == null ||
                    qcm.getQuestions() == null || qcm.getQuestions().isEmpty()) {
                log.warn("Invalid QCM details: id={}, titre={}, dateCreation={}, questions={}",
                        qcm.getId(), qcm.getTitre(), qcm.getDateCreation(), qcm.getQuestions());
                return new ResponseEntity<>(Map.of("error", "ID, titre, dateCreation, and at least one question are required"),
                        HttpStatus.BAD_REQUEST);
            }

            // Validate questions and responses
            for (Question question : qcm.getQuestions()) {
                if (question.getContenu() == null || question.getReponses() == null || question.getReponses().isEmpty()) {
                    log.warn("Invalid question: contenu={}, reponses={}", question.getContenu(), question.getReponses());
                    return new ResponseEntity<>(Map.of("error", "Each question must have contenu and at least one response"),
                            HttpStatus.BAD_REQUEST);
                }
                for (Reponse reponse : question.getReponses()) {
                    if (reponse.getContenu() == null) {
                        log.warn("Invalid response: contenu={}", reponse.getContenu());
                        return new ResponseEntity<>(Map.of("error", "Each response must have contenu"),
                                HttpStatus.BAD_REQUEST);
                    }
                }
            }

            // Update QCM
            QCM updatedQcm = qcmService.updateQCM(qcm, classeId, professeur.getId());
            log.info("Successfully updated QCM with ID: {}", updatedQcm.getId());

            // Return success message
            return new ResponseEntity<>(Map.of("message", "QCM updated successfully", "qcm", updatedQcm),
                    HttpStatus.OK);
        } catch (QcmNotFoundException e) {
            log.error("QCM not found: {}", e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (ValidationException e) {
            log.error("Failed to update QCM: {}", e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Failed to update QCM: {}", e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<?> deleteQcm(@PathVariable Long id,
                                       @RequestHeader("Authorization") String authHeader) {
        try {
            log.info("Received request to delete QCM with ID: {}", id);

            // Validate Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
            }

            String token = authHeader.replace("Bearer ", "");

            // Validate JWT token
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            // Extract email from token
            String email = jwtTokenProvider.getUsernameFromJWT(token);
            log.info("Extracted email: {}", email);

            // Verify professor
            Utilisateur professeur = utilisateurRepository.findByEmail(email);
            if (professeur == null) {
                log.warn("Utilisateur not found with email: {}", email);
                return new ResponseEntity<>(Map.of("error", "Utilisateur not found"), HttpStatus.BAD_REQUEST);
            }

            // Delete QCM
            qcmService.deleteQCM(id, professeur.getId());
            log.info("Successfully deleted QCM with ID: {}", id);

            // Return success message
            return new ResponseEntity<>(Map.of("message", "QCM deleted successfully"), HttpStatus.OK);
        } catch (QcmNotFoundException e) {
            log.error("QCM not found: {}", e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (ValidationException e) {
            log.error("Failed to delete QCM: {}", e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Failed to delete QCM: {}", e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
