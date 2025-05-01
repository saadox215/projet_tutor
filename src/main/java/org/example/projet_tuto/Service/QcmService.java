package org.example.projet_tuto.Service;

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

import java.util.Optional;
import java.util.Set;

@Service
public class QcmService {

    private static final Logger log = LoggerFactory.getLogger(QcmService.class);

    private final QCMRespository qcmRepository;
    private final ClasseRepository classeRepository;
    private final UtilisateurRepository utilisateurRepository;

    public QcmService(QCMRespository qcmRepository,
                      ClasseRepository classeRepository,
                      UtilisateurRepository utilisateurRepository) {
        this.qcmRepository = qcmRepository;
        this.classeRepository = classeRepository;
        this.utilisateurRepository = utilisateurRepository;
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

        // Verify class and professor
        verifyClassAndProfesseur(classeId);

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

        // Save QCM (cascades to questions and responses)
        return qcmRepository.save(qcm);
    }

    @Transactional
    public QCM updateQCM(QCM qcm, Long classeId, Long professeurId) throws ValidationException, QcmNotFoundException {
        log.info("Updating QCM with ID: {}, titre: {}, classeId: {}, professeurId: {}",
                qcm.getId(), qcm.getTitre(), classeId, professeurId);

        // Verify class and professor
        verifyClassAndProfesseur(classeId);

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
    public void deleteQCM(Long id, Long classeId, Long professeurId) throws ValidationException, QcmNotFoundException {
        log.info("Deleting QCM with ID: {}, classeId: {}, professeurId: {}", id, classeId, professeurId);

        // Verify class and professor
        verifyClassAndProfesseur(classeId);

        // Check if QCM exists
        QCM existing = qcmRepository.findById(id)
                .orElseThrow(() -> new QcmNotFoundException("QCM not found with ID: " + id));

        // Delete QCM (cascades to questions and responses)
        qcmRepository.deleteById(id);
    }
}