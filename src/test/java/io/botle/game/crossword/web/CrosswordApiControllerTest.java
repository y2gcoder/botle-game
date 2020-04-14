package io.botle.game.crossword.web;

import io.botle.game.crossword.domain.puzzle.PuzzleRepository;
import io.botle.game.crossword.domain.quiz.QuizRepository;
import io.botle.game.crossword.web.dto.PuzzleSaveRequestDto;
import io.botle.game.crossword.web.dto.QuizSaveRequestDto;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

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

        PuzzleSaveRequestDto requestDto = PuzzleSaveRequestDto.builder()
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

        String url = "http://localhost:"+port+"/api/v1/puzzle";

        //when
//        ResponseEntity<Long> responseEntity = restTemplate.postForEntity(url, requestDto, quizSaveRequestDtoList, Long.class);

    }
}
