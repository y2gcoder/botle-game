package io.botle.game.crossword.domain.puzzle;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import io.botle.game.crossword.web.dto.CrosswordResponseDto;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import static io.botle.game.crossword.domain.puzzle.QPuzzle.puzzle;
import static io.botle.game.crossword.domain.quiz.QQuiz.quiz;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class PuzzleRepositorySupport extends QuerydslRepositorySupport {
    private final JPAQueryFactory queryFactory;


    /**
     * Creates a new {@link QuerydslRepositorySupport} instance for the given domain type.
     *
     *
     */
    public PuzzleRepositorySupport(JPAQueryFactory queryFactory) {
        super(Puzzle.class);
        this.queryFactory = queryFactory;
    }

    public List<Puzzle> findByTitle(String title) {
        return queryFactory.selectFrom(puzzle)
                .where(puzzle.title.eq(title))
                .fetch();
    }

    public List<CrosswordResponseDto> findPuzzles() {
        List<Puzzle> puzzleList = queryFactory
                .selectFrom(puzzle)
                .leftJoin(puzzle.quizzes, quiz).fetchJoin()
                .fetch();

        return puzzleList.stream()
                .map(p -> new CrosswordResponseDto(p.getP_seq(),
                        p.getTitle(),
                        p.getCategory_grade(),
                        p.getP_desc(),
                        p.getCategory_subject(),
                        p.getP_keyword(),
                        p.getQuizzes()
                ))
                .collect(Collectors.toList());
    }

    public CrosswordResponseDto findPuzzleBySeq(Long p_seq) {
        List<Puzzle> puzzleOne = queryFactory
                .selectFrom(puzzle)
                .leftJoin(puzzle.quizzes, quiz).fetchJoin()
                .where(puzzle.p_seq.eq(p_seq))
                .fetch();

        CrosswordResponseDto result = new CrosswordResponseDto(puzzleOne.get(0));
        return result;
    }
}
