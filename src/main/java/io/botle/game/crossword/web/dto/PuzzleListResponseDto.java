package io.botle.game.crossword.web.dto;

import io.botle.game.crossword.domain.puzzle.Puzzle;
import io.botle.game.crossword.domain.quiz.Quiz;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class PuzzleListResponseDto {
    private Long p_seq;
    private String title;
    private String category_grade;
    private String p_desc;
    private String category_subject;
    private String p_keyword;

//    private List<Quiz> quizzes = new ArrayList<>();

    public PuzzleListResponseDto(Puzzle entity) {
        this.p_seq = entity.getP_seq();
        this.title = entity.getTitle();
        this.category_grade = convertToString(entity.getCategory_grade());
        this.p_desc = entity.getP_desc();
        this.category_subject = entity.getCategory_subject();
        this.p_keyword = entity.getP_keyword();
//        this.quizzes = entity.getQuizzes();
    }

    private String convertToString(Integer category_grade) {
        if (category_grade < 7) {
            return "초"+category_grade;
        }else if(category_grade >= 7 && category_grade < 10){
            return "중"+(category_grade-6);
        }else if(category_grade >=10 && category_grade < 13) {
            return "고"+(category_grade-9);
        }else {
            return "미정";
        }

    }

}
