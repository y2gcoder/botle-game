package io.botle.game.crossword.service;

import io.botle.game.crossword.domain.puzzle.Puzzle;
import io.botle.game.crossword.domain.puzzle.PuzzleRepository;
import io.botle.game.crossword.domain.puzzle.PuzzleRepositorySupport;
import io.botle.game.crossword.domain.quiz.Quiz;
import io.botle.game.crossword.domain.quiz.QuizRepository;
import io.botle.game.crossword.util.CrosswordMod;
import io.botle.game.crossword.web.dto.*;
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

    @Transactional
    public Long update(Long p_seq, PuzzleUpdateRequestDto requestDto) {
        Puzzle puzzle = puzzleRepositorySupport.findPuzzleBySeq2(p_seq);

        List<Quiz> quizzes = puzzle.getQuizzes();
        List<QuizUpdateRequestDto> quizUpdateRequestDtos = requestDto.getQuizzes();
        // 퀴즈 삭제도 고려해야 함. 전부 삭제했다가 다시 넣는 것은 어떨까?
        if(quizzes != null){
            quizRepository.deleteAllByPuzzleSeq(p_seq);

            for(int i=0;i<quizUpdateRequestDtos.size();i++){
                Quiz quiz = quizUpdateRequestDtos.get(i).toEntity();
                puzzle.addQuiz(quiz);
            }
        }
        // 이건 update 하면 그냥 될 것 같고
        puzzle.update(requestDto.getTitle(),
                requestDto.getCategory_grade(),
                requestDto.getP_desc(),
                requestDto.getCategory_subject(),
                requestDto.getP_keyword()
        );


        return p_seq;
    }

    @Transactional
    public void delete (Long p_seq) {
        // quiz는 싹 다 삭제
        Puzzle puzzle = puzzleRepositorySupport.findPuzzleBySeq2(p_seq);

        List<Quiz> quizzes = puzzle.getQuizzes();
        if(quizzes != null) {
            quizRepository.deleteAllByPuzzleSeq(p_seq);
            puzzleRepository.delete(puzzle);
        }
    }
}
