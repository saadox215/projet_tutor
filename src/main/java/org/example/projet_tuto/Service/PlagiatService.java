package org.example.projet_tuto.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.example.projet_tuto.Repository.PlagiatRepository;
import org.example.projet_tuto.Repository.SoumissionRepository;
import org.example.projet_tuto.entities.Plagiat;
import org.example.projet_tuto.entities.Soumission;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class PlagiatService {

    private final SoumissionRepository soumissionRepository;
    private final PlagiatRepository plagiatRepository;
    private final OkHttpClient client;
    private final ObjectMapper objectMapper;

    public PlagiatService(SoumissionRepository soumissionRepository,
                          PlagiatRepository plagiatRepository) {
        this.soumissionRepository = soumissionRepository;
        this.plagiatRepository = plagiatRepository;
        this.client = new OkHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public void analyserEtSauvegarder(MultipartFile fichier, Soumission soumission) throws IOException {
        RequestBody fileBody = RequestBody.create(
                fichier.getBytes(), MediaType.parse("application/pdf"));

        MultipartBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("fichier", fichier.getOriginalFilename(), fileBody)
                .build();

        Request request = new Request.Builder()
                .url("http://127.0.0.1:8000/api/plagiat/")
                .post(requestBody)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String responseBody = response.body().string();
                Map<String, Object> result = objectMapper.readValue(responseBody, Map.class);

                float score = result.containsKey("score") ? Float.parseFloat(result.get("score").toString()) : 0f;
                String texte = result.containsKey("texte_similaire") ? result.get("texte_similaire").toString() : "";
                String fichierSimilaire = result.containsKey("avec") ? result.get("avec").toString() : "Aucun";

                System.out.println("✅ Score de plagiat = " + score + "%");
                System.out.println("📄 Fichier similaire : " + fichierSimilaire);
                System.out.println("📝 Texte similaire (début) : " + (texte.length() > 100 ? texte.substring(0, 100) + "..." : texte));

                soumission.setNomFichier(fichier.getOriginalFilename());
                soumission.setTexte(texte);
                soumissionRepository.save(soumission);

                Plagiat plagiat = new Plagiat();
                plagiat.setScorePlagiat(score);
                plagiat.setSoumission(soumission);
                plagiatRepository.save(plagiat);

            } else {
                throw new RuntimeException("❌ Échec de la requête Django : HTTP " + response.code());
            }
        }
    }
}
