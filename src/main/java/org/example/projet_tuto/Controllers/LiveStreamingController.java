package org.example.projet_tuto.Controllers;
import jakarta.validation.Valid;
import org.example.projet_tuto.DTOS.LiveStreamingDTO;
import org.example.projet_tuto.Repository.UtilisateurRepository;
import org.example.projet_tuto.entities.LiveStreaming;
import org.example.projet_tuto.Service.ProfesseurServices;
import org.example.projet_tuto.Service.ZoomService;
import org.example.projet_tuto.entities.Utilisateur;
import org.example.projet_tuto.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/prof/live-streaming")
public class LiveStreamingController {

    private static final Logger log = LoggerFactory.getLogger(LiveStreamingController.class);

    private final ProfesseurServices professeurServices;
    private final ZoomService zoomService;
    private final UtilisateurRepository utilisateurRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    public LiveStreamingController(ProfesseurServices professeurServices, ZoomService zoomService, UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.professeurServices = professeurServices;
        this.zoomService = zoomService;
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<?> createLiveStreaming(@Valid @RequestBody LiveStreaming liveStreaming,
                                                 @RequestParam Long classeId, @RequestHeader("Authorization") String authHeader) {
        try {
            log.info("Received request to create live streaming with subject: {}", liveStreaming.getSujet());
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
            }

            String token = authHeader.replace("Bearer ", "");

            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            String email = jwtTokenProvider.getUsernameFromJWT(token);
            System.out.println("Extracted email: " + email);

            Utilisateur professeur = utilisateurRepository.findByEmail(email);
            log.info("Creating live streaming with subject: {}", liveStreaming.getSujet());
            if (liveStreaming.getSujet() == null || liveStreaming.getDateCreation() == null) {
                log.warn("Invalid live streaming details: sujet={}, dateCreation={}",
                        liveStreaming.getSujet(), liveStreaming.getDateCreation());
                return new ResponseEntity<>(Map.of("error", "Subject and start time are required"), HttpStatus.BAD_REQUEST);
            }
            Map<String, Object> zoomResponse = zoomService.createMeeting(liveStreaming);
            liveStreaming.setMeetingId(Long.parseLong(zoomResponse.get("id").toString()));
            liveStreaming.setJoinUrl((String) zoomResponse.get("join_url"));
            professeurServices.createLiveStreaming(liveStreaming,classeId , professeur.getId());
            log.info("Successfully created live streaming and Zoom meeting with ID: {}", zoomResponse.get("id"));
            return new ResponseEntity<>(zoomResponse, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Failed to create live streaming: {}", e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<Map<String, Object>> updateLiveStreaming(@PathVariable Long id, @Valid @RequestBody LiveStreaming liveStreaming) {
        try {
            log.info("Updating live streaming with ID: {}", id);
            Optional<LiveStreaming> existingStreaming = professeurServices.findLiveStreamingById(id);
            if (existingStreaming.isEmpty()) {
                log.warn("Live streaming with ID {} not found", id);
                return new ResponseEntity<>(Map.of("error", "Live streaming not found"), HttpStatus.NOT_FOUND);
            }
            liveStreaming.setId(id);
            professeurServices.updateLiveStreaming(liveStreaming);
            if (liveStreaming.getMeetingId() != null) {
                zoomService.updateMeeting(liveStreaming.getMeetingId(), liveStreaming);
                log.info("Successfully updated live streaming and Zoom meeting with ID: {}", id);
                return new ResponseEntity<>(Map.of("message", "Live streaming and Zoom meeting updated"), HttpStatus.OK);
            } else {
                log.warn("No Zoom meeting ID associated with live streaming ID: {}", id);
                return new ResponseEntity<>(Map.of("message", "Live streaming updated, no Zoom meeting ID provided"), HttpStatus.OK);
            }
        } catch (Exception e) {
            log.error("Failed to update live streaming with ID {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<Map<String, Object>> deleteLiveStreaming(@PathVariable Long id) {
        try {
            log.info("Deleting live streaming with ID: {}", id);
            Optional<LiveStreaming> existingStreaming = professeurServices.findLiveStreamingById(id);
            if (existingStreaming.isEmpty()) {
                log.warn("Live streaming with ID {} not found", id);
                return new ResponseEntity<>(Map.of("error", "Live streaming not found"), HttpStatus.NOT_FOUND);
            }
            professeurServices.deleteLiveStreaming(id);
            if (existingStreaming.get().getMeetingId() != null) {
                zoomService.deleteMeeting(existingStreaming.get().getMeetingId());
                log.info("Successfully deleted live streaming and Zoom meeting with ID: {}", id);
                return new ResponseEntity<>(Map.of("message", "Live streaming and Zoom meeting deleted"), HttpStatus.OK);
            } else {
                log.warn("No Zoom meeting ID associated with live streaming ID: {}", id);
                return new ResponseEntity<>(Map.of("message", "Live streaming deleted, no Zoom meeting ID provided"), HttpStatus.OK);
            }
        } catch (Exception e) {
            log.error("Failed to delete live streaming with ID {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<?> getLiveStreaming(@PathVariable Long id) {
        try {
            log.info("Retrieving live streaming with ID: {}", id);
            Optional<LiveStreaming> liveStreaming = professeurServices.findLiveStreamingById(id);
            if (liveStreaming.isEmpty()) {
                log.warn("Live streaming with ID {} not found", id);
                return new ResponseEntity<>(Map.of("error", "Live streaming not found"), HttpStatus.NOT_FOUND);
            }
            log.info("Successfully retrieved live streaming with ID: {}", id);
            return new ResponseEntity<>(liveStreaming.get(), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Failed to retrieve live streaming with ID {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<?> getAllLiveStreamings(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
            }

            // Extract token
            String token = authHeader.replace("Bearer ", "");

            // Validate token
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            // Extract email
            String email = jwtTokenProvider.getUsernameFromJWT(token);
            System.out.println("Extracted email: " + email);

            Utilisateur professeur = utilisateurRepository.findByEmail(email);
            log.info("Retrieving all live streamings");
            List<LiveStreamingDTO> liveStreamings = professeurServices.findAllLiveStreamings(professeur.getId()).stream().toList();
            log.info("Successfully retrieved {} live streamings", liveStreamings.size());
            return new ResponseEntity<>(liveStreamings, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Failed to retrieve live streamings: {}", e.getMessage(), e);
            return new ResponseEntity<>(List.of(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}