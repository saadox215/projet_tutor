package org.example.projet_tuto.Service;

import org.example.projet_tuto.DTOS.ClassDTO;
import org.example.projet_tuto.DTOS.UserDTO;
import org.example.projet_tuto.Repository.AnnonceRepository;
import org.example.projet_tuto.Repository.ClasseRepository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.DTOS.AnnonceDTO;
import org.example.projet_tuto.entities.Annonce;
import org.example.projet_tuto.entities.Classe;
import org.example.projet_tuto.entities.Utilisateur;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfesseurService {
    private final AnnonceRepository annonceRepository;
    private final UtilisateurRepository userRepository;
    private final ClasseRepository classeRepository;

    public ProfesseurService(AnnonceRepository annonceRepository, UtilisateurRepository userRepository, ClasseRepository classeRepository) {
        this.annonceRepository = annonceRepository;
        this.userRepository = userRepository;
        this.classeRepository = classeRepository;
    }

    // ======= createAnnonce =======
    public void createAnnonces(Annonce annonce, Long id_prof, Long id_classe) {
        annonce.setClasse(classeRepository.findById(id_classe).orElse(null));
        annonce.setProfesseur(userRepository.findById(id_prof).orElse(null));
        annonceRepository.save(annonce);
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

    public List<ClassDTO> getClassesByProfId(Long id_prof) {
        return classeRepository.findAll().stream().filter(classe -> classe.getEnseignant() != null && classe.getEnseignant().getId().equals(id_prof))
                .map(this::mapToClassDTO)
                .collect(Collectors.toList());
    }
    private ClassDTO mapToClassDTO(Classe classe) {
        List<Utilisateur> students = userRepository.findByClasse(classe);
        List<UserDTO> studentDTOs = students.stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());

        int studentCount = studentDTOs.size();

        String professorName = classe.getEnseignant() != null
                ? classe.getEnseignant().getName() + " " + classe.getEnseignant().getPrenom()
                : "Not Assigned";

        return ClassDTO.builder()
                .id(classe.getId())
                .name(classe.getNom())
                .professorId(classe.getEnseignant() != null ? classe.getEnseignant().getId() : null)
                .professorName(professorName)
                .students(studentDTOs)
                .studentCount(studentCount)
                .build();
    }
    //-------------------Qcm----------------------

}