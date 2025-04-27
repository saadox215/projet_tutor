package org.example.projet_tuto.Controllers;

import org.example.projet_tuto.DTOS.LiveStreamingDTO;
import org.example.projet_tuto.Exception.AnnonceExceptionHandler;
import org.example.projet_tuto.Exception.QcmNotFoundException;
import org.example.projet_tuto.Exception.StreamingNotFoundException;
import org.example.projet_tuto.Repository.LiveStreamingRepository;
import org.example.projet_tuto.Service.ProfesseurService;
import org.example.projet_tuto.Service.ProfesseurServices;
import org.example.projet_tuto.Service.ZoomService;
import org.example.projet_tuto.entities.Annonce;
import org.example.projet_tuto.entities.LiveStreaming;
import org.example.projet_tuto.entities.QCM;
import org.example.projet_tuto.entities.Reponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/prof")
public class ProfesseurController {
    private final ProfesseurService professeurService;
    private final ZoomService zoomService;


    public ProfesseurController(ProfesseurService professeurService,
                                ZoomService zoomService) {
        this.professeurService = professeurService;
        this.zoomService = zoomService;
    }

    @PostMapping("/livestreaming")
    @PreAuthorize("hasRole('ROLE_PROFESSEUR')")
    public ResponseEntity<String> createLiveStreaming(@RequestBody LiveStreamingDTO liveStreamingDTO) {
        LiveStreaming liveStreaming = liveStreamingDTO.toLiveStreaming();

        if (liveStreaming.getSujet() == null || liveStreaming.getDateCreation() == null) {
            return ResponseEntity.badRequest().body("Invalid meeting details");
        }

        try {
            Map<String, Object> zoomResponse = zoomService.createMeeting(liveStreaming);
            String joinUrl = (String) zoomResponse.get("join_url");
            if (joinUrl == null) {
                return ResponseEntity.badRequest().body("Failed to retrieve Zoom join_url");
            }
            Long zoomMeetingId = Long.parseLong(zoomResponse.get("id").toString());

            liveStreaming.setMeetingURL(joinUrl);
            liveStreaming.setZoomMeetingId(zoomMeetingId);
            professeurService.createLiveStreaming(liveStreaming);

            return ResponseEntity.ok(joinUrl);
        } catch (WebClientResponseException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body("Zoom API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating meeting: " + e.getMessage());
        }
    }
    @PutMapping("/livestreaming/info/{id}")
    @PreAuthorize("hasRole('ROLE_PROFESSOR')")
    public ResponseEntity<String> modifierLiveStreaming(@PathVariable Long id, @RequestBody LiveStreamingDTO liveStreamingDTO) {
        LiveStreaming liveStreaming = liveStreamingDTO.toLiveStreaming();

        if (liveStreaming.getSujet() == null || liveStreaming.getDateCreation() == null) {
            return ResponseEntity.badRequest().body("Invalid meeting details");
        }

        try {
            LiveStreaming existing = professeurService.findLiveStreamingById(id)
                    .orElseThrow(() -> new RuntimeException("LiveStreaming not found with ID: " + id));

            zoomService.updateMeeting(existing.getZoomMeetingId(), liveStreaming);


            existing.setSujet(liveStreaming.getSujet());
            existing.setDateCreation(liveStreaming.getDateCreation());
            professeurService.updateLiveStreaming(existing);

            return ResponseEntity.ok("Meeting updated successfully");
        } catch (WebClientResponseException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body("Zoom API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating meeting: " + e.getMessage());
        }
    }

    @DeleteMapping("/livestreaming/{id}")
    @PreAuthorize("hasRole('ROLE_PROFESSOR')")
    public ResponseEntity<String> deleteLiveStreaming(@PathVariable Long id) {
        try {

            LiveStreaming existing = professeurService.findLiveStreamingById(id)
                    .orElseThrow(() -> new RuntimeException("LiveStreaming not found with ID: " + id));

            zoomService.deleteMeeting(existing.getZoomMeetingId());

            professeurService.deleteLiveStreaming(id);

            return ResponseEntity.ok("Meeting deleted successfully");
        } catch (WebClientResponseException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body("Zoom API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting meeting: " + e.getMessage());
        }
    }
//    @GetMapping("Evaluation/Qcm/create")
//    public ResponseEntity<?> createQcm(@RequestBody QCM qcm) {
//        professeurService.createQCM(qcm);
//        return new ResponseEntity<>(HttpStatus.CREATED);
//    }
//    @PostMapping("/evaluation/qcm/info")
//    public ResponseEntity<?> updateQcm(@RequestBody QCM qcm) {
//        try {
//            professeurServices.modifierQCM(qcm);
//            return ResponseEntity.ok("QCM updated successfully.");
//        } catch (QcmNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating QCM.");
//        }
//    }
//    @DeleteMapping("evaluation/qcm/delete")
//    public ResponseEntity<?> deleteQcm(@PathVariable Long id) {
//        try {
//            professeurServices.deleteQCM(id);
//            return ResponseEntity.ok("QCM deleted successfully.");
//        } catch (QcmNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting QCM.");
//        }
//
//
//    }
}
