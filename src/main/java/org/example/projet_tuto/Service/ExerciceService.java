package org.example.projet_tuto.Service;

import jakarta.annotation.PreDestroy;
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
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExerciceService {

    private final ExerciceRepository exerciceRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ClasseRepository classeRepository;
    private final FichierService fichierService;
    private final EmailService emailService;
    private final ExecutorService executorService;

    public ExerciceService(ExerciceRepository exerciceRepository,
                           UtilisateurRepository utilisateurRepository,
                           ClasseRepository classeRepository,
                           FichierService fichierService,
                           EmailService emailService) {
        this.exerciceRepository = exerciceRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.classeRepository = classeRepository;
        this.fichierService = fichierService;
        this.emailService = emailService;
        this.executorService = Executors.newFixedThreadPool(2);
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
        // Notify students about the new exercise
        List<Utilisateur> students = utilisateurRepository.findByClasse(classe);
        if (students != null) {
            for (Utilisateur student : students) {
                executorService.submit(() -> {
                    emailService.sendEmail(
                            student.getEmail(),
                            "Nouvel exercice publié",
                            "Bonjour " + student.getName() + ",\n\n" +
                                    "Un nouvel exercice a été publié dans votre classe \"" + savedExercice.getClasse().getNom() + "\".\n\n" +
                                    "Détails de l'exercice :\n" +
                                    "- Titre : " + savedExercice.getTitre() + "\n" +
                                    "- Description : " + savedExercice.getDescription() + "\n" +
                                    "- Date limite : " + (savedExercice.getDateLimite() != null ? savedExercice.getDateLimite().toString() : "Non spécifiée") + "\n\n" +
                                    "Publié par : " + savedExercice.getProfesseur().getName() + " " + savedExercice.getProfesseur().getPrenom() + "\n\n" +
                                    "Veuillez consulter la plateforme pour plus de détails et pour soumettre votre travail avant la date limite.\n\n" +
                                    "Cordialement,\n" +
                                    "L'équipe pédagogique"
                    );
                });
            }
        } else {
            throw new RuntimeException("Classe non trouvée");
        }
        return mapToDTO(savedExercice);
    }
    @PreDestroy
    public void shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
        }
    }
    public FichierDTO addFichierToExercice(Long exerciceId, Long professeurId, MultipartFile file) throws IOException {
        Exercice exercice = exerciceRepository.findById(exerciceId)
                .orElseThrow(() -> new RuntimeException("Exercice non trouvé"));

        if (!exercice.getProfesseur().getId().equals(professeurId)) {
            throw new IllegalStateException("Seul le professeur ayant créé l'exercice peut y ajouter des fichiers");
        }

        return fichierService.uploadFichierForExercice(file, exerciceId, professeurId);
    }

    public List<ExerciceDTO> getExercicesByClasseId(Long classeId, Long professeurId) {
        List<Exercice> exercices = exerciceRepository.findByClasseIdOrderByDatePubDesc(classeId).stream().filter(
                exercice -> exercice.getProfesseur().getId().equals(professeurId)
        ).toList();
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
                .filter(fichier -> fichier.getSoumission() == null )
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

    public void deleteExercice(Long idExercice) {
        Exercice exercice = exerciceRepository.findById(idExercice)
                .orElseThrow(() -> new RuntimeException("Exercice non trouvé"));

        // Supprimer tous les fichiers associés à l'exercice
        for (Fichier fichier : exercice.getFichiers()) {
            try {
                fichierService.deleteFichier(fichier.getId(), exercice.getProfesseur().getId());
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de la suppression du fichier: " + e.getMessage());
            }
        }

        // Supprimer l'exercice
        exerciceRepository.delete(exercice);
    }

    public ExerciceDTO updateExercice(Long idExercice, ExerciceDTO exerciceDTO) {
        Exercice exercice = exerciceRepository.findById(idExercice)
                .orElseThrow(() -> new RuntimeException("Exercice non trouvé"));

        // Mettre à jour les informations de l'exercice
        exercice.setTitre(exerciceDTO.getTitre());
        exercice.setDescription(exerciceDTO.getDescription());
        exercice.setDateLimite(exerciceDTO.getDateLimite());
        exercice.setArchived(exerciceDTO.isArchived());

        Exercice updatedExercice = exerciceRepository.save(exercice);
        return mapToDTO(updatedExercice);
    }

    public ExerciceDTO archiveExercice(Long idExercice, Long id) {
        Exercice exercice = exerciceRepository.findById(idExercice)
                .orElseThrow(() -> new RuntimeException("Exercice non trouvé"));

        // Vérifier que l'utilisateur est le professeur de l'exercice
        if (!exercice.getProfesseur().getId().equals(id)) {
            throw new IllegalStateException("Seul le professeur ayant créé l'exercice peut l'archiver");
        }

        // Archiver l'exercice
        exercice.setArchived(true);
        Exercice updatedExercice = exerciceRepository.save(exercice);
        return mapToDTO(updatedExercice);
    }

    public ExerciceDTO dearchiveExercice(Long idExercice, Long id) {
        Exercice exercice = exerciceRepository.findById(idExercice)
                .orElseThrow(() -> new RuntimeException("Exercice non trouvé"));

        // Vérifier que l'utilisateur est le professeur de l'exercice
        if (!exercice.getProfesseur().getId().equals(id)) {
            throw new IllegalStateException("Seul le professeur ayant créé l'exercice peut le désarchiver");
        }

        // Désarchiver l'exercice
        exercice.setArchived(false);
        Exercice updatedExercice = exerciceRepository.save(exercice);
        return mapToDTO(updatedExercice);
    }
}