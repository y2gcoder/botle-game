package io.botle.game.crossword.web.dto;

import io.botle.game.crossword.domain.puzzle.Puzzle;
import io.botle.game.crossword.domain.quiz.Quiz;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class CrosswordResponseDto {
    private Long p_seq;
    private String title;
    private Integer category_grade;
    private String p_desc;
    private String category_subject;
    private String p_keyword;

    private List<Quiz> quizzes = new ArrayList<>();

    public CrosswordResponseDto(Puzzle entity) {
        this.p_seq = entity.getP_seq();
        this.title = entity.getTitle();
        this.category_grade = entity.getCategory_grade();
        this.p_desc = entity.getP_desc();
        this.category_subject = entity.getCategory_subject();
        this.p_keyword = entity.getP_keyword();
        this.quizzes = entity.getQuizzes();
    }
}
