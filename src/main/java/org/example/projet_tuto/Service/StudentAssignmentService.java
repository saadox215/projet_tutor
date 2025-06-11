package org.example.projet_tuto.Service;

import jakarta.transaction.Transactional;
import org.example.projet_tuto.DTOS.FichierDTO;
import org.example.projet_tuto.DTOS.SoumissionDTO;
import org.example.projet_tuto.Repository.*;
import org.example.projet_tuto.entities.Exercice;
import org.example.projet_tuto.entities.Fichier;
import org.example.projet_tuto.entities.Soumission;
import org.example.projet_tuto.entities.Utilisateur;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentAssignmentService {
    private final UtilisateurRepository userRepository;
    private final SoumissionRepository soumissionRepository;
    private final ExerciceService exerciceService;
    private final ExerciceRepository exerciceRepository;
    private final SupabaseStorageService supabaseStorageService;
    private final FichierRepository fichierRepository;

    public StudentAssignmentService(UtilisateurRepository userRepository, SoumissionRepository soumissionRepository, ExerciceService exerciceService, ExerciceRepository exerciceRepository, SupabaseStorageService supabaseStorageService, FichierRepository fichierRepository) {
        this.userRepository = userRepository;
        this.soumissionRepository = soumissionRepository;
        this.exerciceService = exerciceService;
        this.exerciceRepository = exerciceRepository;
        this.supabaseStorageService = supabaseStorageService;
        this.fichierRepository = fichierRepository;
    }
    @Transactional
    public List<SoumissionDTO> getStudentAssignments(Long id_student) {
        try {
            Utilisateur student = userRepository.findById(id_student)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id_student));

            if (student.getSoumissions() == null) {
                throw new RuntimeException("No assignments found for this student");
            }

            return student.getSoumissions().stream()
                    .map(soumission -> new SoumissionDTO(
                            soumission.getId(),
                            soumission.getDateSoumission(),
                            soumission.getNote(),
                            soumission.getExercice().getId(),
                            soumission.getExercice().getTitre(),
                            soumission.getExercice().getDescription(),
                            soumission.getExercice().getFichiers() != null ? soumission.getExercice().getFichiers().stream()
                                    .filter(fichier -> fichier.getSoumission() != null && fichier.getSoumission().getId().equals(soumission.getId()))
                                    .map(fichier -> new FichierDTO(
                                            fichier.getId(),
                                            fichier.getNom(),
                                            fichier.getUrl(),
                                            fichier.getContentType(),
                                            fichier.getTaille(),
                                            fichier.getDateUpload()
                                    ))
                                    .collect(Collectors.toList()) : Collections.emptyList()
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching assignments for student with ID: " + id_student, e);
        }
    }
    public List<FichierDTO> getFilesForAssignment(Long id_student, Long assignmentId) {
        try {
            Utilisateur student = userRepository.findById(id_student)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id_student));

            return soumissionRepository.findById(assignmentId)
                    .orElseThrow(() -> new RuntimeException("Assignment not found with ID: " + assignmentId)).getExercice()
                    .getFichiers().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching files for assignment with ID: " + assignmentId, e);
        }
    }
    public List<FichierDTO> getFilesForStudent(Long id_student) {
        try {
            Utilisateur student = userRepository.findById(id_student)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id_student));

            return student.getClasse().getExercices().stream()
                    .flatMap(exercice -> exercice.getFichiers().stream())
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching files for student with ID: " + id_student, e);
        }
    }
    @Transactional
    public Soumission addAssignment(Long id_student, Long id_exercice) {
        try {
            Utilisateur student = userRepository.findById(id_student)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id_student));

            Soumission soumission = new Soumission();
            soumission.setDateSoumission(LocalDate.now());
            soumission.setNote(0);
            soumission.setExercice(exerciceRepository.findById(id_exercice)
                    .orElseThrow(() -> new RuntimeException("Assignment not found with ID: " + id_exercice)));
            soumission.setEtudiant(student);

            return soumissionRepository.save(soumission);
        } catch (Exception e) {
            throw new RuntimeException("Error adding assignment for student with ID: " + id_student, e);
        }
    }
    @Transactional
    public FichierDTO uploadFileForAssignment(MultipartFile file, Long assignmentId, Long studentId) throws IOException {
        Utilisateur student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));


        // Upload the file to Supabase Storage
        String storagePath = "assignments/" + assignmentId + "/files";
        String fileUrl = supabaseStorageService.uploadFile(file, storagePath);
        Soumission soumission = soumissionRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with ID: " + assignmentId));



        if (fichierRepository.findBySoumissionId(assignmentId) == null) {
            Fichier fichier = new Fichier();
            fichier.setNom(file.getOriginalFilename());
            fichier.setUrl(fileUrl);
            fichier.setContentType(file.getContentType());
            fichier.setTaille(file.getSize());
            fichier.setDateUpload(LocalDateTime.now());
            fichier.setFirebaseStoragePath(storagePath + "/" + file.getOriginalFilename());
            fichier.setSoumission(soumission);
            fichier.setExercice(soumission.getExercice());
            Fichier savedFichier = fichierRepository.save(fichier);
            return mapToDTO(savedFichier);
        }
        Fichier fichier = fichierRepository.findBySoumissionId(assignmentId);
        fichier.setNom(file.getOriginalFilename());
        fichier.setUrl(fileUrl);
        fichier.setContentType(file.getContentType());
        fichier.setTaille(file.getSize());
        fichier.setDateUpload(LocalDateTime.now());
        fichier.setFirebaseStoragePath(storagePath + "/" + file.getOriginalFilename());
        fichier.setSoumission(soumission);
        fichier.setExercice(soumission.getExercice());
        Fichier savedFichier = fichierRepository.save(fichier);
        return mapToDTO(savedFichier);
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
    public void deleteFile(Long assignmentId) {
        Fichier fichier = fichierRepository.findBySoumissionId(assignmentId);
        fichierRepository.delete(fichier);
    }

}
