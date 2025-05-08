package org.example.projet_tuto.Controllers;

import lombok.RequiredArgsConstructor;
import org.example.projet_tuto.Repository.SoumissionRepository;
import org.example.projet_tuto.Service.PlagiatService;
import org.example.projet_tuto.entities.Soumission;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
            Soumission soumission = new Soumission();
            soumission.setDateSoumission(new Date());
            soumission.setNote(0);
            plagiatService.analyserEtSauvegarder(fichier, soumission);

            return ResponseEntity.ok("Soumission et analyse enregistrées avec succès.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur: " + e.getMessage());
        }
    }

}

