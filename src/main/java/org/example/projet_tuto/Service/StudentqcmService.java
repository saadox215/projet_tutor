package org.example.projet_tuto.Service;

import org.example.projet_tuto.DTOS.QCMDTO;
import org.example.projet_tuto.DTOS.QuestionDTO;
import org.example.projet_tuto.DTOS.ReponseDTO;
import org.example.projet_tuto.Exception.ValidationException;
import org.example.projet_tuto.Repository.QCMRespository;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.entities.QCM;
import org.example.projet_tuto.entities.Question;
import org.example.projet_tuto.entities.Reponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentqcmService {
    private final QCMRespository qcmRespository;
    private  final UtilisateurRepository utilisateurRepository;
    public StudentqcmService(QCMRespository qcmRespository, UtilisateurRepository utilisateurRepository) {
        this.qcmRespository = qcmRespository;
        this.utilisateurRepository = utilisateurRepository;
    }
    public Set<QCMDTO> getQcmByStudent(Long studentId) {
        return utilisateurRepository.findById(studentId)
                .map(student -> qcmRespository.findAll().stream()
                        .filter(qcm -> qcm.getClasse() != null
                                && qcm.getClasse().getId().equals(student.getClasse().getId()))
                        .map(this::mapToQCMDTO)
                        .collect(Collectors.toSet()))
                .orElseThrow(() -> new ValidationException("Student not found with ID: " + studentId));
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
