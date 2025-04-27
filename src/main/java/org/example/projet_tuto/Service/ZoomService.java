package org.example.projet_tuto.Service;

import org.example.projet_tuto.entities.LiveStreaming;
import org.example.projet_tuto.entities.LiveStreaming;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class ZoomService {

    private static final Logger log = LoggerFactory.getLogger(ZoomService.class);

    private final WebClient webClient;
    private final String accountId;
    private final String clientId;
    private final String clientSecret;

    public ZoomService(WebClient.Builder webClientBuilder,
                       @Value("${zoom.api.base-url}") String baseUrl,
                       @Value("${zoom.api.account-id}") String accountId,
                       @Value("${zoom.api.client-id}") String clientId,
                       @Value("${zoom.api.client-secret}") String clientSecret) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
        this.accountId = accountId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public String getAccessToken() {
        try {
            String credentials = Base64.getEncoder().encodeToString(
                    (clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8)
            );
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "account_credentials");
            body.add("account_id", accountId);

            log.debug("Requesting Zoom access token for accountId: {}", accountId);

            return webClient.post()
                    .uri("https://zoom.us/oauth/token")
                    .header("Authorization", "Basic " + credentials)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(body))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(response -> {
                        String accessToken = (String) response.get("access_token");
                        if (accessToken == null) {
                            log.error("No access token in Zoom response: {}", response);
                            throw new RuntimeException("No access token in Zoom response: " + response);
                        }
                        log.debug("Successfully retrieved Zoom access token");
                        return accessToken;
                    })
                    .block();
        } catch (WebClientResponseException e) {
            log.error("Failed to get Zoom access token: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to get Zoom access token: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Unexpected error getting Zoom access token: {}", e.getMessage());
            throw new RuntimeException("Unexpected error getting Zoom access token: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> createMeeting(LiveStreaming liveStreaming) {
        try {
            String accessToken = getAccessToken();
            Map<String, Object> meetingDetails = new HashMap<>();
            meetingDetails.put("topic", liveStreaming.getSujet());
            meetingDetails.put("type", 2); // Scheduled meeting
            meetingDetails.put("start_time", liveStreaming.getDateCreation());
            meetingDetails.put("timezone", "UTC");

            log.debug("Creating Zoom meeting with details: {}", meetingDetails);

            return webClient.post()
                    .uri("/users/me/meetings")
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(meetingDetails)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(response -> {
                        if (response.get("join_url") == null || response.get("id") == null) {
                            log.error("Invalid Zoom response: Missing join_url or id: {}", response);
                            throw new RuntimeException("Invalid Zoom response: Missing join_url or id");
                        }
                        log.debug("Successfully created Zoom meeting with ID: {}", response.get("id"));
                        return response;
                    })
                    .block();
        } catch (WebClientResponseException e) {
            log.error("Failed to create Zoom meeting: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to create Zoom meeting: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Unexpected error creating Zoom meeting: {}", e.getMessage());
            throw new RuntimeException("Unexpected error creating Zoom meeting: " + e.getMessage(), e);
        }
    }

    public void updateMeeting(Long meetingId, LiveStreaming liveStreaming) {
        if (meetingId == null || meetingId <= 0) {
            log.error("Invalid meeting ID: {}", meetingId);
            throw new IllegalArgumentException("Invalid meeting ID");
        }
        if (liveStreaming.getSujet() == null || liveStreaming.getDateCreation() == null) {
            log.error("Invalid meeting details: sujet={}, dateCreation={}, duration={}",
                    liveStreaming.getSujet(), liveStreaming.getDateCreation());
            throw new IllegalArgumentException("Invalid meeting details");
        }

        try {
            String accessToken = getAccessToken();
            Map<String, Object> meetingDetails = new HashMap<>();
            meetingDetails.put("topic", liveStreaming.getSujet());
            meetingDetails.put("start_time", liveStreaming.getDateCreation());
            meetingDetails.put("timezone", "UTC");

            log.debug("Updating Zoom meeting ID {} with details: {}", meetingId, meetingDetails);

            webClient.patch()
                    .uri("/meetings/" + meetingId)
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(meetingDetails)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

            log.debug("Successfully updated Zoom meeting ID: {}", meetingId);
        } catch (WebClientResponseException e) {
            log.error("Failed to update Zoom meeting ID {}: {} - {}", meetingId, e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to update Zoom meeting: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Unexpected error updating Zoom meeting ID {}: {}", meetingId, e.getMessage());
            throw new RuntimeException("Unexpected error updating Zoom meeting: " + e.getMessage(), e);
        }
    }

    public void deleteMeeting(Long meetingId) {
        if (meetingId == null || meetingId <= 0) {
            log.error("Invalid meeting ID: {}", meetingId);
            throw new IllegalArgumentException("Invalid meeting ID");
        }

        try {
            String accessToken = getAccessToken();

            log.debug("Deleting Zoom meeting ID: {}", meetingId);

            webClient.delete()
                    .uri("/meetings/" + meetingId)
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

            log.debug("Successfully deleted Zoom meeting ID: {}", meetingId);
        } catch (WebClientResponseException e) {
            log.error("Failed to delete Zoom meeting ID {}: {} - {}", meetingId, e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to delete Zoom meeting: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Unexpected error deleting Zoom meeting ID {}: {}", meetingId, e.getMessage());
            throw new RuntimeException("Unexpected error deleting Zoom meeting: " + e.getMessage(), e);
        }
    }
}