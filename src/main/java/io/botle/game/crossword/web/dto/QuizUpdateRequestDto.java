package io.botle.game.crossword.web.dto;

import io.botle.game.crossword.domain.quiz.Quiz;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class QuizUpdateRequestDto {
    private String word;
    private String q_desc;
    private String hint;
    private String q_keyword;

    private PuzzleUpdateRequestDto puzzleUpdateRequestDto;

    @Builder
    public QuizUpdateRequestDto(String word,
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
