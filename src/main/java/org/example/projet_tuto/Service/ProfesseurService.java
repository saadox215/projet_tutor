package org.example.projet_tuto.Service;

import jakarta.annotation.PreDestroy;
import jakarta.transaction.Transactional;
import org.example.projet_tuto.DTOS.AnnonceDTO;
import org.example.projet_tuto.DTOS.ClassDTO;
import org.example.projet_tuto.DTOS.UserDTO;
import org.example.projet_tuto.Repository.AnnonceRepository;
import org.example.projet_tuto.Repository.ClasseRepository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.entities.Annonce;
import org.example.projet_tuto.entities.Classe;
import org.example.projet_tuto.entities.Utilisateur;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class ProfesseurService {
    private final AnnonceRepository annonceRepository;
    private final UtilisateurRepository userRepository;
    private final ClasseRepository classeRepository;
    private final EmailService emailService;
    private final ExecutorService executorService;

    public ProfesseurService(AnnonceRepository annonceRepository, UtilisateurRepository userRepository,
                             ClasseRepository classeRepository, EmailService emailService) {
        this.annonceRepository = annonceRepository;
        this.userRepository = userRepository;
        this.classeRepository = classeRepository;
        this.emailService = emailService;
        // Initialize a fixed thread pool for email sending
        this.executorService = Executors.newFixedThreadPool(2); // 2 threads for email tasks
    }

    // ======= createAnnonces =======
    public void createAnnonces(Annonce annonce, Long id_prof, Long id_classe) {
        // Set the class and professor for the announcement
        annonce.setClasse(classeRepository.findById(id_classe).orElse(null));
        annonce.setProfesseur(userRepository.findById(id_prof).orElse(null));

        // Save the announcement immediately
        annonceRepository.save(annonce);

        // Asynchronously send emails to students
        List<Utilisateur> students = userRepository.findByClasse(annonce.getClasse());
        if (students != null && !students.isEmpty()) {
            executorService.submit(() -> {
                for (Utilisateur student : students) {
                    String subject = "New Announcement: " + annonce.getTitre();
                    String body = "Dear Student,\n\n" +
                            "A new announcement has been posted:\n" +
                            "Title: " + annonce.getTitre() + "\n" +
                            "Description: " + annonce.getDescription() + "\n" +
                            "Content: " + annonce.getContenu() + "\n\n" +
                            "Best regards,\n" +
                            (annonce.getProfesseur() != null ? annonce.getProfesseur().getName() : "Professor");
                    try {
                        emailService.sendEmail(student.getEmail(), subject, body);
                    } catch (Exception e) {
                        // Log the error to avoid thread termination silently
                        System.err.println("Failed to send email to " + student.getEmail() + ": " + e.getMessage());
                    }
                }
            });
        }
    }



    // ======= getAnnoncesByProfId =======
    public List<AnnonceDTO> getAnnoncesByProfId(Long id_prof) {
        return annonceRepository.findAll().stream()
                .filter(annonce -> annonce.getProfesseur() != null && annonce.getProfesseur().getId().equals(id_prof))
                .map(annonce -> new AnnonceDTO(
                        annonce.getId(),
                        annonce.getTitre(),
                        annonce.getDescription(),
                        annonce.getContenu(),
                        annonce.getDatePublication(),
                        annonce.getProfesseur() != null ? annonce.getProfesseur().getId() : null,
                        annonce.getProfesseur() != null ? annonce.getProfesseur().getEmail() : null,
                        annonce.getClasse() != null ? annonce.getClasse().getId() : null,
                        annonce.getClasse() != null ? Collections.singletonList(annonce.getClasse().getNom()) : null
                ))
                .collect(Collectors.toList());
    }

    // ======= getAnnoncesByClasseId =======
    public List<AnnonceDTO> getAnnoncesByClasseId(Long id_classe) {
        return annonceRepository.findAll().stream()
                .filter(annonce -> annonce.getClasse() != null && annonce.getClasse().getId().equals(id_classe))
                .map(annonce -> new AnnonceDTO(
                        annonce.getId(),
                        annonce.getTitre(),
                        annonce.getDescription(),
                        annonce.getContenu(),
                        annonce.getDatePublication(),
                        annonce.getProfesseur() != null ? annonce.getProfesseur().getId() : null,
                        annonce.getProfesseur() != null ? annonce.getProfesseur().getEmail() : null,
                        annonce.getClasse() != null ? annonce.getClasse().getId() : null,
                        annonce.getClasse() != null ? Collections.singletonList(annonce.getClasse().getNom()) : null
                ))
                .collect(Collectors.toList());
    }

    // ======= getAllAnnonces =======
    public List<AnnonceDTO> getAllAnnonces() {
        return annonceRepository.findAll().stream()
                .map(annonce -> new AnnonceDTO(
                        annonce.getId(),
                        annonce.getTitre(),
                        annonce.getDescription(),
                        annonce.getContenu(),
                        annonce.getDatePublication(),
                        annonce.getProfesseur() != null ? annonce.getProfesseur().getId() : null,
                        annonce.getProfesseur() != null ? annonce.getProfesseur().getEmail() : null,
                        annonce.getClasse() != null ? annonce.getClasse().getId() : null,
                        annonce.getClasse() != null ? Collections.singletonList(annonce.getClasse().getNom()) : null
                ))
                .collect(Collectors.toList());
    }

    // ======= getAnnonceById =======
    public AnnonceDTO getAnnonceById(Long id) {
        Annonce annonce = annonceRepository.findById(id).orElse(null);
        if (annonce == null) {
            return null;
        }
        return new AnnonceDTO(
                annonce.getId(),
                annonce.getTitre(),
                annonce.getDescription(),
                annonce.getContenu(),
                annonce.getDatePublication(),
                annonce.getProfesseur() != null ? annonce.getProfesseur().getId() : null,
                annonce.getProfesseur() != null ? annonce.getProfesseur().getEmail() : null,
                annonce.getClasse() != null ? annonce.getClasse().getId() : null,
                annonce.getClasse() != null ? Collections.singletonList(annonce.getClasse().getNom()) : null
        );
    }

    // ======= deleteAnnonce =======
    public void deleteAnnonce(Long id) {
        Annonce annonce = annonceRepository.findById(id).orElse(null);
        if (annonce != null) {
            annonceRepository.delete(annonce);
        }
    }

    // ======= updateAnnonce =======
    public AnnonceDTO updateAnnonce(Long id, Annonce updatedAnnonce) {
        Annonce existingAnnonce = annonceRepository.findById(id).orElse(null);
        if (existingAnnonce != null) {
            existingAnnonce.setTitre(updatedAnnonce.getTitre());
            existingAnnonce.setDescription(updatedAnnonce.getDescription());
            existingAnnonce.setContenu(updatedAnnonce.getContenu());
            existingAnnonce.setDatePublication(updatedAnnonce.getDatePublication());
            Annonce savedAnnonce = annonceRepository.save(existingAnnonce);
            return new AnnonceDTO(
                    savedAnnonce.getId(),
                    savedAnnonce.getTitre(),
                    savedAnnonce.getDescription(),
                    savedAnnonce.getContenu(),
                    savedAnnonce.getDatePublication(),
                    savedAnnonce.getProfesseur() != null ? savedAnnonce.getProfesseur().getId() : null,
                    savedAnnonce.getProfesseur() != null ? savedAnnonce.getProfesseur().getEmail() : null,
                    savedAnnonce.getClasse() != null ? savedAnnonce.getClasse().getId() : null,
                    savedAnnonce.getClasse() != null ? Collections.singletonList(savedAnnonce.getClasse().getNom()) : null
            );
        }
        return null;
    }

    // ======= getAnnoncesByProfIdAndClasseId =======
    public List<AnnonceDTO> getAnnoncesByProfIdAndClasseId(Long id_prof, Long id_classe) {
        return annonceRepository.findAll().stream()
                .filter(annonce -> annonce.getProfesseur() != null && annonce.getProfesseur().getId().equals(id_prof)
                        && annonce.getClasse() != null && annonce.getClasse().getId().equals(id_classe))
                .map(annonce -> new AnnonceDTO(
                        annonce.getId(),
                        annonce.getTitre(),
                        annonce.getDescription(),
                        annonce.getContenu(),
                        annonce.getDatePublication(),
                        annonce.getProfesseur() != null ? annonce.getProfesseur().getId() : null,
                        annonce.getProfesseur() != null ? annonce.getProfesseur().getEmail() : null,
                        annonce.getClasse() != null ? annonce.getClasse().getId() : null,
                        annonce.getClasse() != null ? Collections.singletonList(annonce.getClasse().getNom()) : null
                ))
                .collect(Collectors.toList());
    }

    // ======= getAnnoncesByProfIdAndClasseIdAndDate =======
    public List<AnnonceDTO> getAnnoncesByProfIdAndClasseIdAndDate(Long id_prof, Long id_classe, String date) {
        return annonceRepository.findAll().stream()
                .filter(annonce -> annonce.getProfesseur() != null && annonce.getProfesseur().getId().equals(id_prof)
                        && annonce.getClasse() != null && annonce.getClasse().getId().equals(id_classe)
                        && annonce.getDatePublication() != null && annonce.getDatePublication().toString().equals(date))
                .map(annonce -> new AnnonceDTO(
                        annonce.getId(),
                        annonce.getTitre(),
                        annonce.getDescription(),
                        annonce.getContenu(),
                        annonce.getDatePublication(),
                        annonce.getProfesseur() != null ? annonce.getProfesseur().getId() : null,
                        annonce.getProfesseur() != null ? annonce.getProfesseur().getEmail() : null,
                        annonce.getClasse() != null ? annonce.getClasse().getId() : null,
                        annonce.getClasse() != null ? Collections.singletonList(annonce.getClasse().getNom()) : null
                ))
                .collect(Collectors.toList());
    }

    // ======= getClassesByProfId =======
    public List<ClassDTO> getClassesByProfId() {
        return classeRepository.findAll().stream()
                .map(this::mapToClassDTO)
                .collect(Collectors.toList());
    }
    private ClassDTO mapToClassDTO(Classe classe) {
        List<Utilisateur> students = userRepository.findByClasse(classe);
        List<UserDTO> studentDTOs = students.stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());

        int studentCount = studentDTOs.size();

        List<String> professorNames = classe.getEnseignants() != null
                ? classe.getEnseignants().stream()
                .map(enseignant -> enseignant.getName() + " " + enseignant.getPrenom())
                .collect(Collectors.toList())
                : Collections.singletonList("Not Assigned");


        return ClassDTO.builder()
                .id(classe.getId())
                .name(classe.getNom())
                .professorName(professorNames)
                .students(studentDTOs)
                .studentCount(studentCount)
                .build();
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
    @Transactional
    public List<ClassDTO> getClassesByProfesseurId(Long id) {
        try {
            return classeRepository.findAll().stream()
                    .filter(classe -> classe.getEnseignants() != null && classe.getEnseignants().stream()
                            .anyMatch(enseignant -> enseignant.getId().equals(id)))
                    .map(this::mapToClassDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error fetching classes for professeur ID: {}" + id);
            throw new RuntimeException("Failed to fetch classes", e);
        }
    }
}