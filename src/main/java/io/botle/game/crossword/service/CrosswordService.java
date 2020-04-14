package io.botle.game.crossword.service;

import io.botle.game.crossword.domain.puzzle.Puzzle;
import io.botle.game.crossword.domain.puzzle.PuzzleRepository;
import io.botle.game.crossword.domain.quiz.QuizRepository;
import io.botle.game.crossword.web.dto.PuzzleSaveRequestDto;
import io.botle.game.crossword.web.dto.QuizSaveRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@RequiredArgsConstructor
@Service
public class CrosswordService {
    private final PuzzleRepository puzzleRepository;
    private final QuizRepository quizRepository;

    @Transactional
    public Long save(PuzzleSaveRequestDto requestDto, List<QuizSaveRequestDto> quizSaveRequestDtoList) {
        Puzzle puzzle = requestDto.toEntity();
        for(int i=0;i<quizSaveRequestDtoList.size();i++){
            QuizSaveRequestDto quizSaveRequestDto = quizSaveRequestDtoList.get(i);
            puzzle.addQuiz(quizSaveRequestDto.toEntity());
        }

        return puzzleRepository.save(puzzle).getP_seq();
    }

}
