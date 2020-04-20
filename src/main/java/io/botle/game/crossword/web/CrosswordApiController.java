package io.botle.game.crossword.web;

import io.botle.game.crossword.service.CrosswordService;
import io.botle.game.crossword.web.dto.CrosswordResponseDto;
import io.botle.game.crossword.web.dto.CrosswordSaveRequestDto;
import io.botle.game.crossword.web.dto.PuzzleListResponseDto;
import io.botle.game.crossword.web.dto.QuizSaveRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class CrosswordApiController {
    private final CrosswordService crosswordService;

    // 퍼즐 이름 중복 체크
    @GetMapping("/api/v1/puzzle/chk/{title}")
    public Integer chkTitle(@PathVariable String title) {

        return crosswordService.chkTitle(title);
    }

    // 다시 만들어본다.
    @PostMapping("/api/v1/puzzle")
    public Long save(@RequestBody CrosswordSaveRequestDto requestDto) {
        System.out.println("확인 : "+requestDto.getQuizSaveRequestDtoList().size());

        List<QuizSaveRequestDto> managedQuizSaveDtoList = new ArrayList<>();
        List<QuizSaveRequestDto> quizSaveRequestDtoList = requestDto.getQuizSaveRequestDtoList();

        quizSaveRequestDtoList.stream().filter(s -> s.getWord() != null && !s.getWord().equals("")).forEach(s -> managedQuizSaveDtoList.add(s));
        requestDto.setQuizSaveRequestDtoList(managedQuizSaveDtoList);

        System.out.println("후 확인 : "+requestDto.getQuizSaveRequestDtoList().size());
        return crosswordService.save(requestDto);
    }

//    @PutMapping("/api/v1/puzzle/{p_seq}")
//    public Long update(@PathVariable Long p_seq,
//                       @RequestBody CrosswordUpdateRequestDto requestDto) {
//        return crosswordService.update(p_seq, requestDto);
//    }

    @GetMapping("/api/v1/puzzle")
    public List<PuzzleListResponseDto> findPuzzles () throws Exception{
        return crosswordService.findPuzzles();
    }

    @GetMapping("/api/v1/puzzle/{p_seq}")
    public CrosswordResponseDto findPuzzleBySeq (@PathVariable Long p_seq) {
        return crosswordService.findPuzzleBySeq(p_seq);
    }
}
