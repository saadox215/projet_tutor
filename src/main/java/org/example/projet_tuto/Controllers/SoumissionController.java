package org.example.projet_tuto.Controllers;

import org.example.projet_tuto.Repository.SoumissionRepository;
import org.example.projet_tuto.Service.PlagiatService;
import org.example.projet_tuto.entities.Soumission;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.util.Date;

@RestController
@RequestMapping("/api/prof/soumissions")
public class SoumissionController {

    private final SoumissionRepository soumissionRepository;
    private final PlagiatService plagiatService;

    public SoumissionController(SoumissionRepository soumissionRepository,
                                PlagiatService plagiatService) {
        this.soumissionRepository = soumissionRepository;
        this.plagiatService = plagiatService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadSoumission(@RequestParam("fichier") MultipartFile fichier) {
        try {
            // Crée un objet Soumission (on pourrait ajouter des infos comme l'étudiant, l'exercice, etc.)
            Soumission soumission = new Soumission();
            soumission.setDateSoumission(new Date());
            soumission.setNote(0);  // à ajuster selon ta logique métier

            // Appel du service de détection de plagiat
            plagiatService.analyserEtSauvegarder(fichier, soumission);

            return ResponseEntity.ok("Soumission reçue et analysée avec succès.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Échec de l’analyse de plagiat : " + e.getMessage());
        }
    }
}
