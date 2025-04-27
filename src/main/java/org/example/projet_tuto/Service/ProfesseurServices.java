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
    private final LiveStreamingRepository liveStreamingRepository;


    @Autowired
    public ProfesseurServices(LiveStreamingRepository liveStreamingRepository) {
        this.liveStreamingRepository = liveStreamingRepository;
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




}
