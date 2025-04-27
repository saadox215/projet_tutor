package org.example.projet_tuto.Service;

import org.example.projet_tuto.Repository.AnnonceRepository;
import org.example.projet_tuto.Repository.ClasseRepository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.entities.Annonce;
import org.example.projet_tuto.entities.Classe;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public void createAnnonces(Annonce annonce, Long id_prof, Long id_classe)
    {
        annonce.setClasse(classeRepository.findById(id_classe).orElse(null));
        annonce.setProfesseur(userRepository.findById(id_prof).orElse(null));
        annonceRepository.save(annonce);
    }
    // ======= getAnnoncesByProfId =======
    public List<Annonce> getAnnoncesByProfId(Long id_prof) {
        return annonceRepository.findAll().stream()
                .filter(annonce -> annonce.getProfesseur().getId().equals(id_prof))
                .toList();
    }
    // ======= getAnnoncesByClasseId =======
    public List<Annonce> getAnnoncesByClasseId(Long id_classe) {
        return annonceRepository.findAll().stream()
                .filter(annonce -> annonce.getClasse().getId().equals(id_classe))
                .toList();
    }
    // ======= getAllAnnonces =======
    public List<Annonce> getAllAnnonces() {
        return annonceRepository.findAll();
    }
    // ======= getAnnonceById =======
    public Annonce getAnnonceById(Long id) {
        return annonceRepository.findById(id).orElse(null);
    }
    // ======= deleteAnnonce =======
    public void deleteAnnonce(Long id) {
        Annonce annonce = annonceRepository.findById(id).orElse(null);
        if (annonce != null) {
            annonceRepository.delete(annonce);
        }
    }
    // ======= updateAnnonce =======
    public Annonce updateAnnonce(Long id, Annonce updatedAnnonce) {
        Annonce existingAnnonce = annonceRepository.findById(id).orElse(null);
        if (existingAnnonce != null) {
            existingAnnonce.setTitre(updatedAnnonce.getTitre());
            existingAnnonce.setDescription(updatedAnnonce.getDescription());
            existingAnnonce.setContenu(updatedAnnonce.getContenu());
            existingAnnonce.setDatePublication(updatedAnnonce.getDatePublication());
            return annonceRepository.save(existingAnnonce);
        }
        return null;
    }
    // ======= getAnnoncesByProfIdAndClasseId =======
    public List<Annonce> getAnnoncesByProfIdAndClasseId(Long id_prof, Long id_classe) {
        return annonceRepository.findAll().stream()
                .filter(annonce -> annonce.getProfesseur().getId().equals(id_prof) && annonce.getClasse().getId().equals(id_classe))
                .toList();
    }
    // ======= getAnnoncesByProfIdAndClasseIdAndDate =======
    public List<Annonce> getAnnoncesByProfIdAndClasseIdAndDate(Long id_prof, Long id_classe, String date) {
        return annonceRepository.findAll().stream()
                .filter(annonce -> annonce.getProfesseur().getId().equals(id_prof) && annonce.getClasse().getId().equals(id_classe) && annonce.getDatePublication().toString().equals(date))
                .toList();
    }
    public List<Classe> getClassesByProfId(Long id_prof) {
        return classeRepository.findByEnseignantId(id_prof);
    }
}
