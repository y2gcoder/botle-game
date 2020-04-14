package io.botle.game.crossword.domain.puzzle;

import io.botle.game.crossword.domain.quiz.Quiz;
import io.botle.game.crossword.domain.quiz.QuizRepository;
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
    QuizRepository quizRepository;



    @After
    public void cleanup() {
        quizRepository.deleteAll();
        puzzleRepository.deleteAll();
    }

//    @Test
//    public void 퍼즐저장_불러오기() {
//        //given
//        String title = "테스트 퍼즐";
//        String p_desc = "테스트 퍼즐 설명입니다.";
//        Integer category_grade = 9;
//        String category_subject = "영어";
//        String p_keyword = "테스트";
//
//        puzzleRepository.save(Puzzle.builder()
//            .title(title)
//            .p_desc(p_desc)
//            .category_grade(category_grade)
//            .category_subject(category_subject)
//            .p_keyword(p_keyword)
//            .build());
//
//        //when
//        List<Puzzle> puzzleList = puzzleRepository.findAll();
//
//        //then
//        Puzzle puzzle = puzzleList.get(0);
//        assertThat(puzzle.getTitle()).isEqualTo(title);
//        assertThat(puzzle.getCategory_grade()).isEqualTo(category_grade);
//
//    }

//    @Test
//    @Transactional
//    public void 퍼즐_전체_저장_불러오기() {
//        //given
//        createPuzzleAndQuiz();
//
//        //when
//        List<Puzzle> puzzleList = puzzleRepository.findAll();
//
//        //then
//        assertThat(puzzleList.size()).isGreaterThan(0);
//        assertThat(puzzleList.get(0).getTitle()).isEqualTo("퍼즐0");
//        assertThat(puzzleList.get(0).getQuizzes().size()).isGreaterThan(0);
//        assertThat(puzzleList.get(0).getQuizzes().get(0).getWord()).isEqualTo("단어0");
//
//    }
//
//    // 퍼즐 자동 생성
//    private void createPuzzleAndQuiz() {
//        for(int i=0;i<5;i++){
//            Puzzle puzzle = Puzzle.builder()
//                    .title("퍼즐"+i)
//                    .p_desc("퍼즐"+i+"에 대한 설명")
//                    .category_grade(9)
//                    .category_subject("영어")
//                    .p_keyword("테스트")
//                    .build();
//            for(int j=0;j<10;j++){
//                puzzle.addQuiz(Quiz.builder()
//                        .word("단어"+j)
//                        .q_desc("단어"+j+"에 대한 설명")
//                        .hint("단어"+j+"에 대한 힌트")
//                        .q_keyword("테스트-단어")
//                        .build()
//                );
//            }
//            puzzleRepository.save(puzzle);
//        }
//        System.out.println("=======End Create Puzzle & Quiz=====");
//    }

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


}
