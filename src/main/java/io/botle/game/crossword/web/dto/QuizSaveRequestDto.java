package io.botle.game.crossword.web.dto;

import io.botle.game.crossword.domain.quiz.Quiz;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class QuizSaveRequestDto {
    //필수
    private String word;
    private String q_desc;

    //선택
    private String hint;
    private String q_keyword;

    private CrosswordSaveRequestDto crosswordSaveRequestDto;

    // 자기 자신 참조 - 나중에 form에서 받을 때 필요
    private List<QuizSaveRequestDto> quizSaveRequestDtoList;

    @Builder
    public QuizSaveRequestDto(String word,
                              String q_desc,
                              String hint,
                              String q_keyword) {
        this.word = word;
        this.q_desc = q_desc;
        this.hint = hint;
        this.q_keyword = q_keyword;
    }

    public Quiz toEntity() {
        return Quiz.builder()
                .word(word)
                .q_desc(q_desc)
                .hint(hint)
                .q_keyword(q_keyword)
                .build();
    }


}
