package org.example.projet_tuto.Controllers;

import org.example.projet_tuto.DTOS.ExerciceDTO;
import org.example.projet_tuto.DTOS.FichierDTO;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.Service.ExerciceService;
import org.example.projet_tuto.Service.FichierService;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/prof/exercices")
@CrossOrigin(origins = "*")
public class ExerciceController {

    @Autowired
    private ExerciceService exerciceService;

    @Autowired
    private FichierService fichierService;
    @Autowired
    private  UtilisateurRepository utilisateurRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<?> createExercice(
            @RequestBody ExerciceDTO exerciceDTO,
            @RequestParam Long classeId, @RequestHeader("Authorization") String authHeader) {
        try{
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
            ExerciceDTO createdExercice = exerciceService.createExercice(exerciceDTO, professeur.getId(), classeId);
            return new ResponseEntity<>(createdExercice, HttpStatus.CREATED);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }


    }

    @PostMapping("/{exerciceId}/fichiers")
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<FichierDTO> addFichierToExercice(
            @PathVariable Long exerciceId,
            @RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String authHeader) throws IOException {
        try{
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            String token = authHeader.replace("Bearer ", "");

            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            String email = jwtTokenProvider.getUsernameFromJWT(token);
            System.out.println("Extracted email: " + email);

            Utilisateur professeur = utilisateurRepository.findByEmail(email);
        FichierDTO fichierDTO = exerciceService.addFichierToExercice(exerciceId, professeur.getId(), file);
        return new ResponseEntity<>(fichierDTO, HttpStatus.CREATED);
    }catch(Exception e){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
    }

    @DeleteMapping("/fichiers/{ficherId}")
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<Void> deleteFichier(
            @PathVariable Long ficherId
            , @RequestHeader("Authorization") String authHeader) throws IOException {
        try{
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            String token = authHeader.replace("Bearer ", "");

            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            String email = jwtTokenProvider.getUsernameFromJWT(token);
            System.out.println("Extracted email: " + email);

            Utilisateur professeur = utilisateurRepository.findByEmail(email);
        fichierService.deleteFichier(ficherId, professeur.getId());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }catch (Exception e){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciceDTO> getExerciceById(@PathVariable Long id) {
        ExerciceDTO exerciceDTO = exerciceService.getExerciceById(id);
        return new ResponseEntity<>(exerciceDTO, HttpStatus.OK);
    }

    @GetMapping("/classe/{classeId}")
    public ResponseEntity<List<ExerciceDTO>> getExercicesByClasseId(@PathVariable Long classeId) {
        List<ExerciceDTO> exerciceDTOs = exerciceService.getExercicesByClasseId(classeId);
        return new ResponseEntity<>(exerciceDTOs, HttpStatus.OK);
    }

    @GetMapping("/professeur/{professeurId}")
    public ResponseEntity<List<ExerciceDTO>> getExercicesByProfesseurId(@PathVariable Long professeurId) {
        List<ExerciceDTO> exerciceDTOs = exerciceService.getExercicesByProfesseurId(professeurId);
        return new ResponseEntity<>(exerciceDTOs, HttpStatus.OK);
    }
}
