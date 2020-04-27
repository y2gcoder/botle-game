package io.botle.game.crossword.web.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class PuzzleUpdateRequestDto {
    private String title;
    private Integer category_grade;
    private String p_desc;
    private String category_subject;
    private String p_keyword;

    private List<QuizUpdateRequestDto> quizzes = new ArrayList<>();

    @Builder
    public PuzzleUpdateRequestDto(String title,
                                  Integer category_grade,
                                  String p_desc,
                                  String category_subject,
                                  String p_keyword,
                                  List<QuizUpdateRequestDto> quizzes) {
        this.title = title;
        this.category_grade = category_grade;
        this.p_desc = p_desc;
        this.category_subject = category_subject;
        this.p_keyword = p_keyword;
        this.quizzes = quizzes;
    }
}
