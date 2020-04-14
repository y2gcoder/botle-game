package io.botle.game.crossword.web.dto;

import io.botle.game.crossword.domain.puzzle.Puzzle;
import io.botle.game.crossword.domain.quiz.Quiz;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class PuzzleSaveRequestDto {
    // 필수
    private String title;
    private Integer category_grade;

    // 선택
    private String p_desc;
    private String category_subject;
    private String p_keyword;

    private List<QuizSaveRequestDto> quizSaveRequestDtoList = new ArrayList<>();

    @Builder
    public PuzzleSaveRequestDto(String title,
                                Integer category_grade,
                                String p_desc,
                                String category_subject,
                                String p_keyword) {
        this.title = title;
        this.category_grade = category_grade;
        this.p_desc = p_desc;
        this.category_subject = category_subject;
        this.p_keyword = p_keyword;
    }

    public Puzzle toEntity() {
        return Puzzle.builder()
                .title(title)
                .category_grade(category_grade)
                .p_desc(p_desc)
                .category_subject(category_subject)
                .p_keyword(p_keyword)
                .build();
    }

    public void addQuizSaveRequestDto(QuizSaveRequestDto quizSaveRequestDto) {
        if(this.quizSaveRequestDtoList == null) {
            this.quizSaveRequestDtoList = new ArrayList<>();
        }
        quizSaveRequestDtoList.add(quizSaveRequestDto);
        quizSaveRequestDto.setPuzzleSaveRequestDto(this);
    }


}
