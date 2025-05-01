package org.example.projet_tuto.Repository;

import org.example.projet_tuto.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
