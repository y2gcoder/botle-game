package io.botle.game.crossword.domain.puzzle;

import io.botle.game.crossword.domain.quiz.Quiz;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Getter
@NoArgsConstructor
@Entity
public class Puzzle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long p_seq;

    @Column(length = 255, nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer category_grade;

    @Column(columnDefinition = "TEXT")
    private String p_desc;

    private String category_subject;

    @Column(columnDefinition = "TEXT")
    private String p_keyword;

    @OneToMany(mappedBy = "puzzle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Quiz> quizzes = new ArrayList<>();

    @Builder
    public Puzzle(String title,
                  Integer category_grade,
                  String p_desc,
                  String category_subject,
                  String p_keyword){
        this.title = title;
        this.p_desc = p_desc;
        this.category_grade = category_grade;
        this.category_subject = category_subject;
        this.p_keyword = p_keyword;
    }

    public void addQuiz(Quiz quiz) {
        if(this.quizzes == null) {
            this.quizzes = new ArrayList<>();
        }
        this.quizzes.add(quiz);
        // 무한 루프 체크
        if(quiz.getPuzzle() != this) {
            quiz.setPuzzle(this);
        }
    }

}
