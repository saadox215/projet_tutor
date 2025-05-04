package org.example.projet_tuto.Service;

import org.example.projet_tuto.DTOS.FichierDTO;
import org.example.projet_tuto.entities.Exercice;
import org.example.projet_tuto.entities.Fichier;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.Repository.ExerciceRepository;
import org.example.projet_tuto.Repository.FichierRepository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@Transactional
public class FichierService {

    private final FichierRepository fichierRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ExerciceRepository exerciceRepository;
    private final SupabaseStorageService supabaseStorageService;


    public FichierService(FichierRepository fichierRepository,
                          UtilisateurRepository utilisateurRepository,
                          ExerciceRepository exerciceRepository,
                          SupabaseStorageService firebaseStorageService) {
        this.fichierRepository = fichierRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.exerciceRepository = exerciceRepository;
        this.supabaseStorageService = firebaseStorageService;
    }

    public FichierDTO uploadFichierForExercice(MultipartFile file, Long exerciceId, Long professeurId) throws IOException {
        Utilisateur professeur = utilisateurRepository.findById(professeurId)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé"));

        Exercice exercice = exerciceRepository.findById(exerciceId)
                .orElseThrow(() -> new RuntimeException("Exercice non trouvé"));

        // Upload du fichier vers Firebase Storage
        String storagePath = "exercices/" + exerciceId + "/files";
        String fileUrl = supabaseStorageService.uploadFile(file, storagePath);

        // Création de l'entité Fichier
        Fichier fichier = Fichier.builder()
                .nom(file.getOriginalFilename())
                .url(fileUrl)
                .contentType(file.getContentType())
                .taille(file.getSize())
                .dateUpload(LocalDateTime.now())
                .firebaseStoragePath(storagePath + "/" + file.getOriginalFilename())
                .professeur(professeur)
                .exercice(exercice)
                .build();

        // Sauvegarder le fichier
        Fichier savedFichier = fichierRepository.save(fichier);

        return mapToDTO(savedFichier);
    }

    public void deleteFichier(Long ficherId, Long professeurId) throws IOException {
        Fichier fichier = fichierRepository.findById(ficherId)
                .orElseThrow(() -> new RuntimeException("Fichier non trouvé"));

        // Vérifier que le professeur est bien le propriétaire du fichier
        if (!fichier.getProfesseur().getId().equals(professeurId)) {
            throw new IllegalStateException("Seul le professeur ayant créé le fichier peut le supprimer");
        }

        // Supprimer le fichier de Firebase Storage
        if (fichier.getFirebaseStoragePath() != null) {
            supabaseStorageService.deleteFile(fichier.getFirebaseStoragePath());
        }

        // Supprimer le fichier de la base de données
        fichierRepository.delete(fichier);
    }

    private FichierDTO mapToDTO(Fichier fichier) {
        return new FichierDTO(
                fichier.getId(),
                fichier.getNom(),
                fichier.getUrl(),
                fichier.getContentType(),
                fichier.getTaille(),
                fichier.getDateUpload()
        );
    }

    public Fichier findById(Long id) {
        return fichierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fichier non trouvé"));
    }

    public void delete(Long id) {
        Fichier fichier = fichierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fichier non trouvé"));
        fichierRepository.delete(fichier);
    }

    public FichierDTO getFichierById(Long id, Long id1) {
        Fichier fichier = fichierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fichier non trouvé"));
        if (fichier.getProfesseur().getId().equals(id1)) {
            return new FichierDTO(
                    fichier.getId(),
                    fichier.getNom(),
                    fichier.getUrl(),
                    fichier.getContentType(),
                    fichier.getTaille(),
                    fichier.getDateUpload()
            );
        } else {
            throw new RuntimeException("Vous n'avez pas la permission de voir ce fichier");
        }
    }
}