package io.botle.game.crossword.domain.puzzle;

import io.botle.game.crossword.web.dto.CrosswordResponseDto;
import io.botle.game.crossword.web.dto.PuzzleListResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PuzzleRepository extends JpaRepository<Puzzle, Long> {
    Integer countByTitle(String title);

    @Query("SELECT p FROM Puzzle p ORDER BY p.p_seq DESC")
    List<Puzzle> findAllDesc();

}
