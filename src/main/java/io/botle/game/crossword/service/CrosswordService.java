package io.botle.game.crossword.service;

import io.botle.game.crossword.domain.puzzle.Puzzle;
import io.botle.game.crossword.domain.puzzle.PuzzleRepository;
import io.botle.game.crossword.domain.puzzle.PuzzleRepositorySupport;
import io.botle.game.crossword.domain.quiz.Quiz;
import io.botle.game.crossword.domain.quiz.QuizRepository;
import io.botle.game.crossword.util.CrosswordMod;
import io.botle.game.crossword.web.dto.CrosswordResponseDto;
import io.botle.game.crossword.web.dto.CrosswordSaveRequestDto;
import io.botle.game.crossword.web.dto.PuzzleListResponseDto;
import io.botle.game.crossword.web.dto.QuizSaveRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Service
public class CrosswordService {
    private final PuzzleRepository puzzleRepository;
    private final QuizRepository quizRepository;
    private final PuzzleRepositorySupport puzzleRepositorySupport;

//    @Transactional
//    public Long save(PuzzleSaveRequestDto requestDto, List<QuizSaveRequestDto> quizSaveRequestDtoList) {
//        Puzzle puzzle = requestDto.toEntity();
//        for(int i=0;i<quizSaveRequestDtoList.size();i++){
//            QuizSaveRequestDto quizSaveRequestDto = quizSaveRequestDtoList.get(i);
//            puzzle.addQuiz(quizSaveRequestDto.toEntity());
//        }
//
//        return puzzleRepository.save(puzzle).getP_seq();
//    }

    @Transactional
    public Integer chkTitle(String title) {
        return puzzleRepository.countByTitle(title);
    }

    // 다시 만들어본다.
    @Transactional
    public Long save(CrosswordSaveRequestDto requestDto) {
        Puzzle puzzle = requestDto.toEntity();
        // 기억하자. 기본은 entity를 넣어주게 되는거다!
        List<QuizSaveRequestDto> quizSaveRequestDtoList = requestDto.getQuizSaveRequestDtoList();
        for(int i=0;i<quizSaveRequestDtoList.size();i++){
            Quiz quiz = quizSaveRequestDtoList.get(i).toEntity();
            puzzle.addQuiz(quiz);
        }
        return puzzleRepository.save(puzzle).getP_seq();
    }

    @Transactional(readOnly = true)
    public List<PuzzleListResponseDto> findPuzzles () throws Exception{
        return puzzleRepository.findAllDesc().stream()
                .map(PuzzleListResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CrosswordResponseDto findPuzzleBySeq(Long p_seq) {
        return puzzleRepositorySupport.findPuzzleBySeq(p_seq);
    }

    @Transactional
    public Map<String, Object> paintPuzzle(Long p_seq) {
        Map<String, Object> map = null;
        CrosswordResponseDto dto = puzzleRepositorySupport.findPuzzleBySeq(p_seq);
        List<Quiz> quizList = dto.getQuizzes();

        List<String> words = quizList.stream().map(q -> q.getWord()).collect(Collectors.toList());

        CrosswordMod makingCrossword = new CrosswordMod();
        map = makingCrossword.makePuzzle(words);

        map.put("info", dto);

        return map;
    }
}
