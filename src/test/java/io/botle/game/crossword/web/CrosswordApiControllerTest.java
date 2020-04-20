package io.botle.game.crossword.web;

import io.botle.game.crossword.domain.puzzle.Puzzle;
import io.botle.game.crossword.domain.puzzle.PuzzleRepository;
import io.botle.game.crossword.domain.puzzle.PuzzleRepositorySupport;
import io.botle.game.crossword.domain.quiz.Quiz;
import io.botle.game.crossword.domain.quiz.QuizRepository;
import io.botle.game.crossword.web.dto.CrosswordResponseDto;
import io.botle.game.crossword.web.dto.CrosswordSaveRequestDto;
import io.botle.game.crossword.web.dto.PuzzleListResponseDto;
import io.botle.game.crossword.web.dto.QuizSaveRequestDto;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class CrosswordApiControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private PuzzleRepository puzzleRepository;

    @Autowired
    private PuzzleRepositorySupport puzzleRepositorySupport;

    @Autowired
    private QuizRepository quizRepository;

    @After
    public void tearDown() throws Exception {
        quizRepository.deleteAll();
        puzzleRepository.deleteAll();
    }

    @Test
    public void Puzzle_등록된다() throws Exception {
        //given
        String title = "퍼즐 1";
        Integer category_grade = 1;

        String p_desc = "퍼즐 1에 대한 설명";
        String category_subject = "영어";
        String p_keyword = "테스트";

        CrosswordSaveRequestDto requestDto = CrosswordSaveRequestDto.builder()
                .title(title)
                .category_grade(category_grade)
                .p_desc(p_desc)
                .category_subject(category_subject)
                .p_keyword(p_keyword)
                .build();

        List<QuizSaveRequestDto> quizSaveRequestDtoList = new ArrayList<>();
        for(int i=0;i<10;i++){
            String word = "단어"+i;
            String q_desc = word+"에 대한 설명";
            String hint = "힌트"+i;
            String q_keyword = "테스트";

            QuizSaveRequestDto quizSaveRequestDto = QuizSaveRequestDto.builder()
                    .word(word)
                    .q_desc(q_desc)
                    .hint(hint)
                    .q_keyword(q_keyword)
                    .build();
            quizSaveRequestDtoList.add(quizSaveRequestDto);
        }
        requestDto.setQuizSaveRequestDtoList(quizSaveRequestDtoList);

        String url = "http://localhost:"+port+"/api/v1/puzzle";

        //when
        ResponseEntity<Long> responseEntity = restTemplate.postForEntity(url, requestDto, Long.class);

        //then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isGreaterThan(0L);

        List<Quiz> quizList = quizRepository.findAll();

        assertThat(quizList.get(0).getWord()).isEqualTo("단어0");
        assertThat(quizList.get(0).getPuzzle().getTitle()).isEqualTo(title);

        List<CrosswordResponseDto> crosswordResponseDtoList = puzzleRepositorySupport.findPuzzles();
        assertThat(crosswordResponseDtoList.get(0).getQuizzes().size()).isEqualTo(10);


    }

    @Test
    public void Puzzle_제목_중복_확인() throws Exception {
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

        String url = "http://localhost:"+port+"/api/v1/puzzle/chk/"+title;

        //when
        ResponseEntity<Integer> responseEntity = restTemplate.getForEntity(url, Integer.class);

        // then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isGreaterThan(0);

    }

    @Test
    public void Puzzle들_불러오기() throws Exception {

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

        String url = "http://localhost:"+port+"/api/v1/puzzle";

//        ResponseEntity<List<PuzzleListResponseDto>> responseEntity = restTemplate.getForEntity(url, List<PuzzleListResponseDto>.class);

        //then
//        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);


    }

    @Test
    public void Puzzle_불러오기() throws Exception{
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

        // 불러오기
        List<CrosswordResponseDto> crosswordResponseDtoList = puzzleRepositorySupport.findPuzzles();
        Long target_seq = crosswordResponseDtoList.get(0).getP_seq();

        String url = "http://localhost:"+port+"/api/v1/puzzle/"+target_seq;

//

//
//        //when
//        ResponseEntity<CrosswordResponseDto> responseEntity = restTemplate.getForEntity(url, CrosswordResponseDto.class);
////        CrosswordResponseDto responseDto = restTemplate.getForObject(url, CrosswordResponseDto.class);
//
//        //then
//        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

    }


}
