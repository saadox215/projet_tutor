package org.example.projet_tuto.Repository;

import org.example.projet_tuto.entities.QCM;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QCMRespository extends JpaRepository<QCM, Long> {
}