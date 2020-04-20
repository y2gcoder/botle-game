package io.botle.game.crossword.domain.puzzle;

import io.botle.game.crossword.domain.quiz.Quiz;
import io.botle.game.crossword.domain.quiz.QuizRepository;
import io.botle.game.crossword.web.dto.CrosswordResponseDto;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


@RunWith(SpringRunner.class)
@SpringBootTest
public class PuzzleRepositoryTest {

    @Autowired
    PuzzleRepository puzzleRepository;

    @Autowired
    PuzzleRepositorySupport puzzleRepositorySupport;

    @Autowired
    QuizRepository quizRepository;

    @After
    public void cleanup() {
        quizRepository.deleteAll();
        puzzleRepository.deleteAll();
    }

    @Test
    public void save_puzzle_quiz_확인() {
        //given
        String title = "테스트 퍼즐";
        Integer category_grade = 9;

        String p_desc = "테스트 퍼즐 설명입니다.";
        String category_subject = "영어";
        String p_keyword = "테스트";

        Puzzle puzzle = puzzleRepository.save(Puzzle.builder()
                .title(title)
                .p_desc(p_desc)
                .category_grade(category_grade)
                .category_subject(category_subject)
                .p_keyword(p_keyword)
                .build()
        );

        for(int i=0;i<10;i++){
            String word = "단어"+i;
            String q_desc = word+"에 대한 설명";
            String hint = word+"에 대한 힌트";
            String q_keyword = "테스트";

            Quiz quiz = Quiz.builder()
                    .word(word)
                    .q_desc(q_desc)
                    .hint(hint)
                    .q_keyword(q_keyword)
                    .build();
            quiz.setPuzzle(puzzle);

            quizRepository.save(quiz);
        }

        //when
        List<Quiz> quizList = quizRepository.findAll();

        //then
        assertThat(quizList.get(0).getWord()).isEqualTo("단어0");
        assertThat(quizList.get(0).getPuzzle().getTitle()).isEqualTo(title);
    }

    @Test
    public void querydsl_기본_기능_확인() {
        //given
        String title = "테스트 퍼즐";
        Integer category_grade = 9;

        String p_desc = "테스트 퍼즐 설명입니다.";
        String category_subject = "영어";
        String p_keyword = "테스트";

        Puzzle puzzle = puzzleRepository.save(Puzzle.builder()
                .title(title)
                .p_desc(p_desc)
                .category_grade(category_grade)
                .category_subject(category_subject)
                .p_keyword(p_keyword)
                .build()
        );

        //when
        List<Puzzle> result = puzzleRepositorySupport.findByTitle(title);

        //then
        assertThat(result.size()).isEqualTo(1);
        assertThat(result.get(0).getCategory_grade()).isEqualTo(category_grade);
    }

    @Test
    public void querydsl_left_join_실행() {
        //given
        String title = "테스트 퍼즐";
        Integer category_grade = 9;

        String p_desc = "테스트 퍼즐 설명입니다.";
        String category_subject = "영어";
        String p_keyword = "테스트";

        Puzzle puzzle = puzzleRepository.save(Puzzle.builder()
                .title(title)
                .p_desc(p_desc)
                .category_grade(category_grade)
                .category_subject(category_subject)
                .p_keyword(p_keyword)
                .build()
        );

        for(int i=0;i<10;i++){
            String word = "단어"+i;
            String q_desc = word+"에 대한 설명";
            String hint = word+"에 대한 힌트";
            String q_keyword = "테스트";

            Quiz quiz = Quiz.builder()
                    .word(word)
                    .q_desc(q_desc)
                    .hint(hint)
                    .q_keyword(q_keyword)
                    .build();
            quiz.setPuzzle(puzzle);

            quizRepository.save(quiz);
        }

        //when
        List<CrosswordResponseDto> result = puzzleRepositorySupport.findPuzzles();

        //then
        assertThat(result.get(0).getQuizzes().size()).isGreaterThan(0);
        assertThat(result.get(0).getQuizzes().get(2).getWord()).isEqualTo("단어2");
    }

    @Test
    public void querydsl_퍼즐_하나_호출() {
        //given
        String title = "테스트 퍼즐";
        Integer category_grade = 9;

        String p_desc = "테스트 퍼즐 설명입니다.";
        String category_subject = "영어";
        String p_keyword = "테스트";

        Puzzle puzzle = puzzleRepository.save(Puzzle.builder()
                .title(title)
                .p_desc(p_desc)
                .category_grade(category_grade)
                .category_subject(category_subject)
                .p_keyword(p_keyword)
                .build()
        );

        for(int i=0;i<10;i++){
            String word = "단어"+i;
            String q_desc = word+"에 대한 설명";
            String hint = word+"에 대한 힌트";
            String q_keyword = "테스트";

            Quiz quiz = Quiz.builder()
                    .word(word)
                    .q_desc(q_desc)
                    .hint(hint)
                    .q_keyword(q_keyword)
                    .build();
            quiz.setPuzzle(puzzle);

            quizRepository.save(quiz);
        }

        //when
        CrosswordResponseDto responseDto = puzzleRepositorySupport.findPuzzleBySeq(1L);

        //then
        assertThat(responseDto.getTitle()).isEqualTo(title);
        assertThat(responseDto.getQuizzes().size()).isEqualTo(10);
        assertThat(responseDto.getQuizzes().get(5).getWord()).isEqualTo("단어5");
    }

}
