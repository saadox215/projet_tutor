package org.example.projet_tuto.Service;

import lombok.RequiredArgsConstructor;
import org.example.projet_tuto.entities.Plagiat;
import org.example.projet_tuto.entities.Soumission;
import org.example.projet_tuto.Repository.PlagiatRepository;
import org.example.projet_tuto.Repository.SoumissionRepository;
import org.example.projet_tuto.utils.MultipartInputStreamFileResource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

@Service

public class SoumissionService {

    private final SoumissionRepository soumissionRepository;
    private final PlagiatRepository plagiatRepository;
    private final RestTemplate restTemplate;


    public SoumissionService(SoumissionRepository soumissionRepository,
                             PlagiatRepository plagiatRepository,
                             RestTemplate restTemplate) {
        this.soumissionRepository = soumissionRepository;
        this.plagiatRepository = plagiatRepository;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadSoumission(@RequestParam("fichier") MultipartFile fichier) throws IOException {
        Soumission soumission = this.soumettreEtAnalyserPlagiat(fichier, 1L, 1L);


        return ResponseEntity.ok(soumission);
    }

    public Soumission soumettreEtAnalyserPlagiat(MultipartFile fichier, Long exerciceId, Long etudiantId) throws IOException {
        // 1. Créer l'entité Soumission
        Soumission soumission = new Soumission();
        soumission.setDateSoumission(new Date());
        // Remplis exercice et utilisateur si besoin avec leurs repositories
        // Exemple : soumission.setExercice(exerciceRepository.findById(exerciceId).get());
        //           soumission.setEtudiant(utilisateurRepository.findById(etudiantId).get());

        // 2. Appel vers le microservice Django
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultipartInputStreamFileResource resource = new MultipartInputStreamFileResource(fichier.getInputStream(), fichier.getOriginalFilename());


        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("fichier", resource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        String djangoUrl = "http://localhost:8000/api/plagiat/";
        ResponseEntity<Map> response = restTemplate.postForEntity(djangoUrl, requestEntity, Map.class);
        float score = Float.parseFloat(response.getBody().get("similarite").toString());


        // 3. Traiter la réponse du microservice
        //float score = extraireScore(response.getBody());

        // 4. Enregistrer la soumission
        soumissionRepository.save(soumission);

        // 5. Créer et enregistrer le score de plagiat
        Plagiat plagiat = new Plagiat();
        plagiat.setSoumission(soumission);
        plagiat.setScorePlagiat(score);
        plagiatRepository.save(plagiat);

        return soumission;
    }

    private float extraireScore(String json) {
        try {
            return Float.parseFloat(json.replaceAll("[^0-9.]", ""));
        } catch (Exception e) {
            return 0f;
        }
    }
}
