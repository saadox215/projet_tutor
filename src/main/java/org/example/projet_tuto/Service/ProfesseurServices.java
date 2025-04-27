package org.example.projet_tuto.Service;

import jakarta.persistence.Id;
import org.example.projet_tuto.Exception.StreamingNotFoundException;
import org.example.projet_tuto.Repository.*;
import org.example.projet_tuto.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class ProfesseurServices {
    private final AnnonceRepository annonceRepository;
    private final LiveStreamingRepository liveStreamingRepository;
    private final QcmRepository qcmRepository;
    private final QuestionRepository questionRepository;
    private final ReponseRepository reponseRepository;

    @Autowired
    public ProfesseurServices(AnnonceRepository annonceRepository,
                              LiveStreamingRepository liveStreamingRepository,
                              QcmRepository qcmRepository,
                              QuestionRepository questionRepository, ReponseRepository reponseRepository) {
        this.annonceRepository = annonceRepository;
        this.liveStreamingRepository = liveStreamingRepository;
        this.qcmRepository = qcmRepository;
        this.questionRepository = questionRepository;
        this.reponseRepository = reponseRepository;
    }

    public void createAnnonce(Annonce annonce){
        annonceRepository.save(annonce);

    }
    public void modifierAnnonce(Annonce annonce){

        annonceRepository.save(annonce);
    }
    public void deleteAnnonce(Long IdAnnonce){
        annonceRepository.deleteById(IdAnnonce);
    }
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
    public void createQCM(QCM qcm){
        questionRepository.saveAll(qcm.getQuestions());
        qcmRepository.save(qcm);
    }
    public void modifierQCM(QCM qcm){
        questionRepository.saveAll(qcm.getQuestions());
        qcmRepository.save(qcm);
    }
    public void deleteQCM(Long Id_qcm){
        QCM qcm = qcmRepository.findById(Id_qcm).get();
        if(qcm.getQuestions().isEmpty()){
            questionRepository.deleteAll(qcm.getQuestions());
            qcmRepository.deleteById(qcm.getId());
        }

    }
    public void createQuestion(Set<Reponse> reponses,Question question){
        reponseRepository.saveAll(reponses);
        question.setReponses(reponses);
        questionRepository.save(question);
    }
    public void modifierQuestion(Question question){
        reponseRepository.saveAll(question.getReponses());
        questionRepository.save(question);
    }
    public void deleteQuestion(Long Id_question){
        Question question = questionRepository.findById(Id_question).orElse(null);
        if(question != null){
            reponseRepository.deleteAll(question.getReponses());
            questionRepository.deleteById(question.getId());
        }

    }

}
