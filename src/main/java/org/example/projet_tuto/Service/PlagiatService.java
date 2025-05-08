package org.example.projet_tuto.Service;

import lombok.RequiredArgsConstructor;
import org.example.projet_tuto.Repository.PlagiatRepository;
import org.example.projet_tuto.Repository.SoumissionRepository;
import org.example.projet_tuto.entities.Plagiat;
import org.example.projet_tuto.entities.Soumission;
import org.example.projet_tuto.utils.MultipartInputStreamFileResource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service

public class PlagiatService {

    private final SoumissionRepository soumissionRepository;
    private final PlagiatRepository plagiatRepository;
    private final RestTemplate restTemplate;

    public PlagiatService(SoumissionRepository soumissionRepository,
                          PlagiatRepository plagiatRepository,
                          RestTemplate restTemplate) {
        this.soumissionRepository = soumissionRepository;
        this.plagiatRepository = plagiatRepository;
        this.restTemplate = restTemplate;
    }

    public void analyserEtSauvegarder(MultipartFile fichier, Soumission soumission) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // ✅ Utiliser la classe custom pour inclure le nom de fichier


        MultipartInputStreamFileResource fileResource =
                new MultipartInputStreamFileResource(fichier.getInputStream(), fichier.getOriginalFilename());

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("fichier", fileResource);


        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // Envoi de la requête vers Django
        ResponseEntity<Map> response = restTemplate.postForEntity(
                "http://127.0.0.1:8000/api/plagiat/",
                requestEntity,
                Map.class
        );

        float score = Float.parseFloat(response.getBody().get("similarite").toString());

        soumission.setNomFichier(fichier.getOriginalFilename());
        soumission.setTexte(response.getBody().get("texte").toString());
        soumissionRepository.save(soumission);

        Plagiat p = new Plagiat();
        p.setScorePlagiat(score);
        p.setSoumission(soumission);
        plagiatRepository.save(p);
    }
}
