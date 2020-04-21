package io.botle.game.crossword.domain.quiz;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.botle.game.crossword.domain.BaseTimeEntity;
import io.botle.game.crossword.domain.puzzle.Puzzle;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
public class Quiz extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long q_seq;

    @Column(length = 255, nullable = false)
    private String word;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String q_desc;

    @Column(columnDefinition = "TEXT")
    private String hint;

    @Column(columnDefinition = "TEXT")
    private String q_keyword;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "puzzle_p_seq")
    private Puzzle puzzle;

    @Builder
    public Quiz(String word,
                String q_desc,
                String hint,
                String q_keyword) {
        this.word = word;
        this.q_desc = q_desc;
        this.hint = hint;
        this.q_keyword = q_keyword;
    }

    public void setPuzzle(Puzzle puzzle) {
        this.puzzle = puzzle;
        // 무한 루프 체크
        if(!puzzle.getQuizzes().contains(this)){
            puzzle.getQuizzes().add(this);
        }
    }
}
