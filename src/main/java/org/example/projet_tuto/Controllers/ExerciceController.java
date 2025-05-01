package org.example.projet_tuto.Controllers;

import org.example.projet_tuto.DTOS.ExerciceDTO;
import org.example.projet_tuto.DTOS.FichierDTO;
import org.example.projet_tuto.Service.ExerciceService;
import org.example.projet_tuto.Service.FichierService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<ExerciceDTO> createExercice(
            @RequestBody ExerciceDTO exerciceDTO,
            @RequestParam Long professeurId,
            @RequestParam Long classeId) {
        ExerciceDTO createdExercice = exerciceService.createExercice(exerciceDTO, professeurId, classeId);
        return new ResponseEntity<>(createdExercice, HttpStatus.CREATED);
    }

    @PostMapping("/{exerciceId}/fichiers")
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<FichierDTO> addFichierToExercice(
            @PathVariable Long exerciceId,
            @RequestParam Long professeurId,
            @RequestParam("file") MultipartFile file) throws IOException {
        FichierDTO fichierDTO = exerciceService.addFichierToExercice(exerciceId, professeurId, file);
        return new ResponseEntity<>(fichierDTO, HttpStatus.CREATED);
    }

    @DeleteMapping("/fichiers/{ficherId}")
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<Void> deleteFichier(
            @PathVariable Long ficherId,
            @RequestParam Long professeurId) throws IOException {
        fichierService.deleteFichier(ficherId, professeurId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
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
