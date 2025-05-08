package org.example.projet_tuto.Repository;



import org.example.projet_tuto.entities.Plagiat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlagiatRepository extends JpaRepository<Plagiat, Long> {
}
