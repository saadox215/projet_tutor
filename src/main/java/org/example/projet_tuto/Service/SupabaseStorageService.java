package org.example.projet_tuto.Service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.project-url}")
    private String projectUrl;

    @Value("${supabase.api-key}")
    private String apiKey;

    @Value("${supabase.bucket}")
    private String bucketName;

    private final OkHttpClient httpClient = new OkHttpClient();

    public String uploadFile(MultipartFile file, String directory) throws IOException {
        String filename = file.getOriginalFilename();
        String filePath = directory + "/" + filename;

        RequestBody fileBody = RequestBody.create(file.getBytes(), MediaType.parse(file.getContentType()));

        Request request = new Request.Builder()
                .url(projectUrl + "/storage/v1/object/" + bucketName + "/" + filePath)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", file.getContentType())
                .addHeader("x-upsert", "true")
                .put(fileBody)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Échec de l'upload: " + response);
            }
        }

        return projectUrl + "/storage/v1/object/public/" + bucketName + "/" + filePath;
    }


    public void deleteFile(String filePath) throws IOException {
        System.out.println("DELETE URL: " + projectUrl + "/storage/v1/object/" + bucketName + "/" + filePath);
        System.out.println("Headers:");
        System.out.println("Authorization: Bearer " + apiKey);
        System.out.println("apikey: " + apiKey);

        Request request = new Request.Builder()
                .url(projectUrl + "/storage/v1/object/" + bucketName + "/" + filePath)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("apikey", apiKey) // important !
                .delete()
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            System.out.println("Delete status: " + response.code());
            if (!response.isSuccessful()) {
                throw new IOException("Échec suppression: " + response.body().string());
            }
        }
    }


    private String generateUniqueFilename(String originalFilename) {
        String extension = "";
        if (originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            originalFilename = originalFilename.substring(0, originalFilename.lastIndexOf("."));
        }
        return originalFilename.replaceAll("[^a-zA-Z0-9]", "_") + "_" +
                UUID.randomUUID().toString() + extension;
    }
}
