package io.botle.game.crossword.domain.puzzle;

import io.botle.game.crossword.web.dto.CrosswordResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PuzzleRepository extends JpaRepository<Puzzle, Long> {

//    @Query("SELECT DISTINCT p FROM puzzle p left outer join quiz q on p.p_seq = q.puzzle_p_seq ORDER BY p.p_seq DESC")
//    List<CrosswordResponseDto> findAllDesc();
}
