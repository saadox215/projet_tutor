package org.example.projet_tuto.Repository;

import org.example.projet_tuto.entities.LiveStreaming;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LiveStreamingRepository extends JpaRepository<LiveStreaming, Long> {
}
