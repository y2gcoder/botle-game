package io.botle.game.crossword.web.dto;

import io.botle.game.crossword.domain.puzzle.Puzzle;
import io.botle.game.crossword.domain.quiz.Quiz;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
public class CrosswordResponseDto {
    private Long p_seq;
    private String title;
    private Integer category_grade;
    private String p_desc;
    private String category_subject;
    private String p_keyword;

    private List<Quiz> quizzes = new ArrayList<>();

}
