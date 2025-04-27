package org.example.projet_tuto.Service;

import org.example.projet_tuto.Repository.AnnonceRepository;
import org.example.projet_tuto.Repository.ClasseRepository;
import org.example.projet_tuto.Repository.LiveStreamingRepository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.DTOS.AnnonceDTO;
import org.example.projet_tuto.entities.Annonce;
import org.example.projet_tuto.entities.Classe;
import org.example.projet_tuto.entities.LiveStreaming;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfesseurService {
    private final AnnonceRepository annonceRepository;
    private final UtilisateurRepository userRepository;
    private final ClasseRepository classeRepository;
    private final LiveStreamingRepository liveStreamingRepository;

    public ProfesseurService(AnnonceRepository annonceRepository, UtilisateurRepository userRepository, ClasseRepository classeRepository, LiveStreamingRepository liveStreamingRepository) {
        this.annonceRepository = annonceRepository;
        this.userRepository = userRepository;
        this.classeRepository = classeRepository;
        this.liveStreamingRepository = liveStreamingRepository;
    }
    // ============ Zoom services handling ========

    public void createLiveStreaming(LiveStreaming liveStreaming) {
        liveStreamingRepository.save(liveStreaming);
    }

    public void updateLiveStreaming(LiveStreaming liveStreaming) {
        liveStreamingRepository.save(liveStreaming);
    }

    public void deleteLiveStreaming(Long id) {
        liveStreamingRepository.deleteById(id);
    }

    public Optional<LiveStreaming> findLiveStreamingById(Long id) {
        return liveStreamingRepository.findById(id);
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
                        annonce.getClasse() != null ? annonce.getClasse().getId() : null
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
                        annonce.getClasse() != null ? annonce.getClasse().getId() : null
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
                        annonce.getClasse() != null ? annonce.getClasse().getId() : null
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
                annonce.getClasse() != null ? annonce.getClasse().getId() : null
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
                    savedAnnonce.getClasse() != null ? savedAnnonce.getClasse().getId() : null
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
                        annonce.getClasse() != null ? annonce.getClasse().getId() : null
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
                        annonce.getClasse() != null ? annonce.getClasse().getId() : null
                ))
                .collect(Collectors.toList());
    }

    public List<Classe> getClassesByProfId(Long id_prof) {
        return classeRepository.findByEnseignantId(id_prof);
    }
}