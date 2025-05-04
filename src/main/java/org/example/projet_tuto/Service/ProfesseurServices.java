
package org.example.projet_tuto.Service;

import jakarta.annotation.PreDestroy;
import jakarta.transaction.Transactional;
import org.example.projet_tuto.DTOS.LiveStreamingDTO;
import org.example.projet_tuto.Repository.ClasseRepository;
import org.example.projet_tuto.Repository.LiveStreamingRepository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.entities.LiveStreaming;
import org.example.projet_tuto.entities.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class ProfesseurServices {
    private final LiveStreamingRepository liveStreamingRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ClasseRepository classeRepository;
    private final EmailService emailService;
    private final ExecutorService executorService;

    @Autowired
    public ProfesseurServices(LiveStreamingRepository liveStreamingRepository, UtilisateurRepository utilisateurRepository, ClasseRepository classeRepository, EmailService emailService) {

        this.emailService = emailService;
        this.liveStreamingRepository = liveStreamingRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.classeRepository = classeRepository;
        this.executorService = Executors.newFixedThreadPool(2);
    }

    @Transactional
    public void createLiveStreaming(LiveStreaming liveStreaming, Long class_id, Long id_prof) {
        if (liveStreaming.getSujet() == null || liveStreaming.getDateCreation() == null) {
            throw new IllegalArgumentException("Subject and start time are required");
        }
        liveStreaming.setClasse(classeRepository.findById(class_id).orElse(null));
        liveStreaming.setProfesseur(utilisateurRepository.findById(id_prof).orElse(null));
        liveStreamingRepository.save(liveStreaming);
        List<Utilisateur> students = utilisateurRepository.findByClasse(liveStreaming.getClasse());
        if (students != null) {
            for (Utilisateur student : students) {
                executorService.submit(() -> {
                    emailService.sendEmail(
                            student.getEmail(),
                            "Live Streaming Notification",
                            "Dear " + student.getName() + ",\n\n" +
                                    "We are pleased to inform you that a new live streaming session has been scheduled.\n\n" +
                                    "Details of the session are as follows:\n" +
                                    "Subject: " + liveStreaming.getSujet() + "\n" +
                                    "Date and Time: " + liveStreaming.getDateCreation() + "\n" +
                                    "Join URL: " + liveStreaming.getJoinUrl() + "\n\n" +
                                    "Please make sure to join on time. If you have any questions, feel free to reach out to your professor.\n\n" +
                                    "Best regards,\n" +
                                    "The Academic Team"
                    );
                });
            }
        }
        else {
            throw new IllegalArgumentException("Class not found");
        }
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
    public void updateLiveStreaming(LiveStreaming liveStreaming) {
        liveStreamingRepository.save(liveStreaming);
    }

    public void deleteLiveStreaming(Long id) {
        liveStreamingRepository.deleteById(id);
    }

    public Optional<LiveStreaming> findLiveStreamingById(Long id) {
        return liveStreamingRepository.findById(id);
    }
    public Set<LiveStreamingDTO> findAllLiveStreamings(Long id) {

        return liveStreamingRepository.findAll().stream().filter(stream -> stream.getProfesseur().getId().equals(id)).map(
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
