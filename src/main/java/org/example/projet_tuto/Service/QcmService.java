package org.example.projet_tuto.Service;

import jakarta.annotation.PreDestroy;
import org.example.projet_tuto.DTOS.QCMDTO;
import org.example.projet_tuto.DTOS.QuestionDTO;
import org.example.projet_tuto.DTOS.ReponseDTO;
import org.example.projet_tuto.entities.Classe;
import org.example.projet_tuto.entities.QCM;
import org.example.projet_tuto.entities.Question;
import org.example.projet_tuto.entities.Reponse;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.Exception.QcmNotFoundException;
import org.example.projet_tuto.Exception.ValidationException;
import org.example.projet_tuto.Repository.ClasseRepository;
import org.example.projet_tuto.Repository.QCMRespository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class QcmService {

    private static final Logger log = LoggerFactory.getLogger(QcmService.class);

    private final QCMRespository qcmRepository;
    private final ClasseRepository classeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final EmailService emailService;
    private final ExecutorService executorService;

    public QcmService(QCMRespository qcmRepository,
                      ClasseRepository classeRepository,
                      UtilisateurRepository utilisateurRepository,
                      EmailService emailService) {
        this.qcmRepository = qcmRepository;
        this.classeRepository = classeRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.emailService = emailService;
        this.executorService = Executors.newFixedThreadPool(2);
    }

    public Classe checkClasse(Long idClasse) throws ValidationException {
        Optional<Classe> classe = classeRepository.findById(idClasse);
        if (classe.isPresent()) {
            return classe.get();
        } else {
            throw new ValidationException("Classe not found with ID: " + idClasse);
        }
    }

    public Utilisateur checkProfesseur() throws ValidationException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Utilisateur> utilisateur = Optional.ofNullable(utilisateurRepository.findByEmail(email));
        if (!utilisateur.isPresent()) {
            throw new ValidationException("Utilisateur not found with email: " + email);
        }
        Utilisateur prof = utilisateur.get();
        boolean isProfesseur = prof.getRoles().stream()
                .anyMatch(role -> "PROFESSEUR".equals(role.getName()));
        if (!isProfesseur) {
            throw new ValidationException("Utilisateur is not a Professeur: " + email);
        }
        return prof;
    }

    public void verifyClassAndProfesseur(Long idClasse) throws ValidationException {
        Classe classe = checkClasse(idClasse);
        Utilisateur professeur = checkProfesseur();
        boolean isAssociated = professeur.getClassesEnseignees().stream()
                .anyMatch(c -> c.getId().equals(idClasse));
        if (!isAssociated) {
            throw new ValidationException("Professeur not associated with Classe ID: " + idClasse);
        }
    }

    @Transactional
    public QCM createQCM(QCM qcm, Long classeId, Long professeurId) throws ValidationException {
        log.info("Creating QCM with titre: {}, classeId: {}, professeurId: {}",
                qcm.getTitre(), classeId, professeurId);
        // Fetch professor and class
        Utilisateur professeur = utilisateurRepository.findById(professeurId)
                .orElseThrow(() -> new ValidationException("Professeur not found with ID: " + professeurId));
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new ValidationException("Classe not found with ID: " + classeId));

        // Set associations
        qcm.setProfesseur(professeur);
        qcm.setClasse(classe);

        // Set QCM reference in questions and questions in responses
        Set<Question> questions = qcm.getQuestions();
        if (questions != null) {
            for (Question question : questions) {
                question.setQcm(qcm);
                Set<Reponse> reponses = question.getReponses();
                if (reponses != null) {
                    for (Reponse reponse : reponses) {
                        reponse.setQuestion(question);
                    }
                }
            }
        }
        QCM qc = qcmRepository.save(qcm);
        // Notify students about the new QCM
        List<Utilisateur> students = utilisateurRepository.findByClasse(classe);
        if (students != null) {
            for (Utilisateur student : students) {
                executorService.submit(() -> {
                    emailService.sendEmail(
                            student.getEmail(),
                            "Notification: New QCM Available",
                            "Dear " + student.getName() + ",\n\n" +
                                    "We are pleased to inform you that a new QCM titled \"" + qc.getTitre() + "\" has been created and is now available on the platform.\n\n" +
                                    "Please log in to the platform to review the QCM and complete it before the deadline. If you have any questions, feel free to reach out to your instructor.\n\n" +
                                    "Best regards,\n" +
                                    "The Academic Team"
                    );
                });
            }
        } else {
            throw new ValidationException("Classe not found");
        }
        // Save QCM (cascades to questions and responses)
        return qc;
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
    public QCM updateQCM(QCM qcm, Long classeId, Long professeurId) throws ValidationException, QcmNotFoundException {
        log.info("Updating QCM with ID: {}, titre: {}, classeId: {}, professeurId: {}",
                qcm.getId(), qcm.getTitre(), classeId, professeurId);


        // Check if QCM exists
        QCM existing = qcmRepository.findById(qcm.getId())
                .orElseThrow(() -> new QcmNotFoundException("QCM not found with ID: " + qcm.getId()));

        // Fetch professor and class
        Utilisateur professeur = utilisateurRepository.findById(professeurId)
                .orElseThrow(() -> new ValidationException("Professeur not found with ID: " + professeurId));
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new ValidationException("Classe not found with ID: " + classeId));

        // Update fields
        existing.setTitre(qcm.getTitre());
        existing.setDateCreation(qcm.getDateCreation());
        existing.setProfesseur(professeur);
        existing.setClasse(classe);
        existing.setQuestions(qcm.getQuestions());

        // Set QCM reference in new questions and questions in responses
        Set<Question> questions = qcm.getQuestions();
        if (questions != null) {
            for (Question question : questions) {
                question.setQcm(existing);
                Set<Reponse> reponses = question.getReponses();
                if (reponses != null) {
                    for (Reponse reponse : reponses) {
                        reponse.setQuestion(question);
                    }
                }
            }
        }

        // Save updated QCM
        return qcmRepository.save(existing);
    }

    @Transactional
    public void deleteQCM(Long id, Long professeurId) throws ValidationException, QcmNotFoundException {
        log.info("Deleting QCM with ID: {}, classeId: {}, professeurId: {}", id, professeurId);


        QCM existing = qcmRepository.findById(id)
                .orElseThrow(() -> new QcmNotFoundException("QCM not found with ID: " + id));

        qcmRepository.deleteById(id);
    }

    public Set<QCMDTO> getAllQcms(Long id) {
        log.info("Fetching all QCMs for Professeur ID: {}", id);
        return qcmRepository.findAll().stream().filter(qcm -> qcm.getProfesseur() != null && qcm.getProfesseur().getId().equals(id))
                .map(qcm -> mapToQCMDTO(qcm))
                .collect(Collectors.toSet());
    }

    private QCMDTO mapToQCMDTO(QCM qcm) {
        return new QCMDTO(
                qcm.getId(),
                qcm.getTitre(),
                qcm.getDateCreation(),
                qcm.getClasse() != null ? qcm.getClasse().getId() : null,
                qcm.getClasse() != null ? qcm.getClasse().getNom() : "toto",
                qcm.getQuestions() != null ? qcm.getQuestions().stream()
                        .map(this::mapToQuestionDTO)
                        .collect(Collectors.toSet()) : null,
                qcm.getProfesseur() != null ? qcm.getProfesseur().getName() : null
        );
    }

    private QuestionDTO mapToQuestionDTO(Question question) {
        return new QuestionDTO(
                question.getId(),
                question.getContenu(),
                question.getNote(),
                question.getReponses() != null ? question.getReponses().stream()
                        .map(this::mapToReponseDTO)
                        .collect(Collectors.toSet()) : null,
                question.getQcm().getProfesseur().getName() != null ? question.getQcm().getProfesseur().getName() : null
        );
    }

    private ReponseDTO mapToReponseDTO(Reponse reponse) {
        return new ReponseDTO(
                reponse.getId(),
                reponse.getContenu(),
                reponse.isCorrecte()
        );
    }
}