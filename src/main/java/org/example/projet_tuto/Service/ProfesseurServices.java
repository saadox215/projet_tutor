
package org.example.projet_tuto.Service;

import jakarta.persistence.Id;
import jakarta.transaction.Transactional;
import org.example.projet_tuto.DTOS.LiveStreamingDTO;
import org.example.projet_tuto.Exception.StreamingNotFoundException;
import org.example.projet_tuto.Repository.*;
import org.example.projet_tuto.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProfesseurServices {
    private final LiveStreamingRepository liveStreamingRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ClasseRepository classeRepository;

    @Autowired
    public ProfesseurServices(LiveStreamingRepository liveStreamingRepository, UtilisateurRepository utilisateurRepository, ClasseRepository classeRepository) {
        this.liveStreamingRepository = liveStreamingRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.classeRepository = classeRepository;
    }

    @Transactional
    public void createLiveStreaming(LiveStreaming liveStreaming, Long class_id, Long id_prof) {
        if (liveStreaming.getSujet() == null || liveStreaming.getDateCreation() == null) {
            throw new IllegalArgumentException("Subject and start time are required");
        }
        liveStreaming.setClasse(classeRepository.findById(class_id).orElse(null));
        liveStreaming.setProfesseur(utilisateurRepository.findById(id_prof).orElse(null));
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
    public Set<LiveStreamingDTO> findAllLiveStreamings() {

        return liveStreamingRepository.findAll().stream().map(
                liveStreaming -> new LiveStreamingDTO(
                        liveStreaming.getId(),
                        liveStreaming.getSujet(),
                        liveStreaming.getDateCreation(),
                        liveStreaming.getClasse() != null ? liveStreaming.getClasse().getNom() : null,
                        liveStreaming.getJoinUrl()
                )
        ).collect(Collectors.toSet());
    }
}
