package org.example.projet_tuto.Service;

import jakarta.transaction.Transactional;
import org.example.projet_tuto.DTOS.AnnonceDTO;
import org.example.projet_tuto.DTOS.ExerciceDTO;
import org.example.projet_tuto.DTOS.FichierDTO;
import org.example.projet_tuto.DTOS.LiveStreamingDTO;
import org.example.projet_tuto.Repository.AnnonceRepository;
import org.example.projet_tuto.Repository.LiveStreamingRepository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.entities.Annonce;
import org.example.projet_tuto.entities.Exercice;
import org.example.projet_tuto.entities.LiveStreaming;
import org.example.projet_tuto.entities.Utilisateur;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AnnonceStudentService {
    private final UtilisateurRepository userRepository;
    private final AnnonceRepository annonceRepository;
    private final LiveStreamingRepository liveStreamingRepository;

    public AnnonceStudentService(UtilisateurRepository userRepository, AnnonceRepository annonceRepository, LiveStreamingRepository liveStreamingRepository) {
        this.userRepository = userRepository;
        this.annonceRepository = annonceRepository;
        this.liveStreamingRepository = liveStreamingRepository;
    }

    @Transactional
    public List<AnnonceDTO> getStudentAnnnonce(Long id_student) {
        try {
            Utilisateur student = userRepository.findById(id_student)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id_student));

            if (student.getClasse() == null || student.getClasse().getAnnonces() == null) {
                throw new RuntimeException("No announcements found for this student");
            }

            // Get the student's seen announcements
            Set<Annonce> annoncesVues = student.getAnnoncesVues() != null ? student.getAnnoncesVues() : Collections.emptySet();

            return student.getClasse().getAnnonces().stream()
                    .filter(annonce -> annonce.getProfesseur() != null && annonce.getClasse() != null)
                    .map(annonce -> new AnnonceDTO(
                            annonce.getId(),
                            annonce.getTitre(),
                            annonce.getDescription(),
                            annonce.getContenu(),
                            annonce.getDatePublication(),
                            annonce.getProfesseur().getId(),
                            annonce.getProfesseur().getName() != null ? annonce.getProfesseur().getName() : "",
                            annonce.getClasse().getId(),
                            annonce.getClasse().getNom() != null ? Collections.singletonList(annonce.getClasse().getNom()) : Collections.emptyList(),
                            annoncesVues.contains(annonce)
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching student announcements: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void markAnnonceAsSeen(Long id_student, Long id_annonce) {
        try {
            Utilisateur student = userRepository.findById(id_student)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id_student));

            Annonce annonce = annonceRepository.findById(id_annonce)
                    .orElseThrow(() -> new RuntimeException("Announcement not found with ID: " + id_annonce));

            if (student.getAnnoncesVues() != null) {
                student.getAnnoncesVues().add(annonce);
            } else {
                student.setAnnoncesVues(Set.of(annonce));
            }
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while marking the announcement as seen: " + e.getMessage(), e);
        }
    }

    @Transactional
    public boolean isAnnonceSeen(Long id, Long idAnnonce) {
        try {
            Utilisateur student = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));

            Annonce annonce = annonceRepository.findById(idAnnonce)
                    .orElseThrow(() -> new RuntimeException("Announcement not found with ID: " + idAnnonce));

            return student.getAnnoncesVues() != null && student.getAnnoncesVues().contains(annonce);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while checking if the announcement is seen: " + e.getMessage(), e);
        }
    }
// ========== exercises ==========
    @Transactional
    public List<ExerciceDTO> getExercices(Long id_student) {
        try {
            Utilisateur student = userRepository.findById(id_student)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id_student));

            if (student.getClasse() == null || student.getClasse().getExercices() == null) {
                throw new RuntimeException("No exercises found for this student");
            }

            return student.getClasse().getExercices().stream()
                    .filter(exercice -> exercice.getProfesseur() != null && exercice.getClasse() != null )
                    .map(this::mapToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching student exercises: " + e.getMessage(), e);
        }
    }


    private ExerciceDTO mapToDTO(Exercice exercice) {
        List<FichierDTO> fichierDTOs = exercice.getFichiers().stream()
                .filter(fichier -> fichier.getProfesseur() != null && fichier.getExercice() != null && fichier.getSoumission() == null)
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

    // ========= meetings student ==========
    @Transactional
    public List<LiveStreamingDTO> getLiveStreamings(Long id_student){
        try {
            Utilisateur student = userRepository.findById(id_student)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id_student));
            if (student.getClasse() == null || student.getClasse().getLiveStreamings() == null) {
                throw new RuntimeException("No live streamings found for this student");
            }
            return student.getClasse().getLiveStreamings().stream()
                    .filter(liveStreaming -> liveStreaming.getProfesseur() != null && liveStreaming.getClasse() != null)
                    .map(liveStreaming -> new LiveStreamingDTO(
                            liveStreaming.getId(),
                            liveStreaming.getSujet(),
                            liveStreaming.getDateCreation(),
                            liveStreaming.getClasse() != null ? liveStreaming.getClasse().getNom() : null,
                            liveStreaming.getJoinUrl()
                    ))
                    .collect(Collectors.toList());
        }catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching student live streamings: " + e.getMessage(), e);
        }
    }

}
