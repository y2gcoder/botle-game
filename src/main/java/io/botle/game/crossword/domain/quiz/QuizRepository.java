package io.botle.game.crossword.domain.quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM quiz i where i.puzzle_p_seq= :p_seq", nativeQuery = true)
    void deleteAllByPuzzleSeq(@Param("p_seq") Long p_seq);
}
