package org.example.projet_tuto.Service;

import org.example.projet_tuto.DTOS.ExerciceDTO;
import org.example.projet_tuto.DTOS.FichierDTO;
import org.example.projet_tuto.entities.Classe;
import org.example.projet_tuto.entities.Exercice;
import org.example.projet_tuto.entities.Fichier;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.Repository.ClasseRepository;
import org.example.projet_tuto.Repository.ExerciceRepository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExerciceService {

    private final ExerciceRepository exerciceRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ClasseRepository classeRepository;
    private final FichierService fichierService;
    public ExerciceService(ExerciceRepository exerciceRepository,
                           UtilisateurRepository utilisateurRepository,
                           ClasseRepository classeRepository,
                           FichierService fichierService) {
        this.exerciceRepository = exerciceRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.classeRepository = classeRepository;
        this.fichierService = fichierService;
    }

    public ExerciceDTO createExercice(ExerciceDTO exerciceDTO, Long professeurId, Long classeId) {
        Utilisateur professeur = utilisateurRepository.findById(professeurId)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé"));

        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));

        Exercice exercice = Exercice.builder()
                .titre(exerciceDTO.getTitre())
                .description(exerciceDTO.getDescription())
                .datePub(LocalDateTime.now())
                .dateLimite(exerciceDTO.getDateLimite())
                .professeur(professeur)
                .classe(classe)
                .build();

        Exercice savedExercice = exerciceRepository.save(exercice);
        return mapToDTO(savedExercice);
    }

    public FichierDTO addFichierToExercice(Long exerciceId, Long professeurId, MultipartFile file) throws IOException {
        Exercice exercice = exerciceRepository.findById(exerciceId)
                .orElseThrow(() -> new RuntimeException("Exercice non trouvé"));

        // Vérifier que le professeur est bien le propriétaire de l'exercice
        if (!exercice.getProfesseur().getId().equals(professeurId)) {
            throw new IllegalStateException("Seul le professeur ayant créé l'exercice peut y ajouter des fichiers");
        }

        return fichierService.uploadFichierForExercice(file, exerciceId, professeurId);
    }

    public List<ExerciceDTO> getExercicesByClasseId(Long classeId) {
        List<Exercice> exercices = exerciceRepository.findByClasseIdOrderByDatePubDesc(classeId);
        return exercices.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<ExerciceDTO> getExercicesByProfesseurId(Long professeurId) {
        List<Exercice> exercices = exerciceRepository.findByProfesseurIdOrderByDatePubDesc(professeurId);
        return exercices.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ExerciceDTO getExerciceById(Long id) {
        Exercice exercice = exerciceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercice non trouvé"));
        return mapToDTO(exercice);
    }

    private ExerciceDTO mapToDTO(Exercice exercice) {
        List<FichierDTO> fichierDTOs = exercice.getFichiers().stream()
                .map(fichier -> new FichierDTO(
                        fichier.getId(),
                        fichier.getNom(),
                        fichier.getUrl(),
                        fichier.getContentType(),
                        fichier.getTaille(),
                        fichier.getDateUpload()
                ))
                .collect(Collectors.toList());

        return new ExerciceDTO(
                exercice.getId(),
                exercice.getTitre(),
                exercice.getDescription(),
                exercice.getDatePub(),
                exercice.getDateLimite(),
                exercice.isArchived(),
                exercice.getProfesseur().getId(),
                exercice.getProfesseur().getName() + " " + exercice.getProfesseur().getPrenom(),
                exercice.getClasse().getId(),
                exercice.getClasse().getNom(),
                fichierDTOs
        );
    }
}