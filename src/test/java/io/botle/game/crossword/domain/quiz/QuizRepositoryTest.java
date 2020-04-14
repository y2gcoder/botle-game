package io.botle.game.crossword.domain.quiz;

import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class QuizRepositoryTest {

    @Autowired
    QuizRepository quizRepository;

    @After
    public void cleanup() {
        quizRepository.deleteAll();
    }

    @Test
    public void 퀴즈저장_불러오기() {
        //given
        String word = "테스트 단어";
        String q_desc = "테스트 단어 설명";
        String hint = "테스트 단어 힌트";
        String q_keyword = "테스트 단어 키워드";

        quizRepository.save(Quiz.builder()
            .word(word)
            .q_desc(q_desc)
            .hint(hint)
            .q_keyword(q_keyword)
            .build());

        //when
        List<Quiz> quizList = quizRepository.findAll();

        //then
        Quiz quiz = quizList.get(0);
        assertThat(quiz.getWord()).isEqualTo(word);
        assertThat(quiz.getQ_desc()).isEqualTo(q_desc);
    }

}
