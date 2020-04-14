package io.botle.game.crossword.web;

import io.botle.game.crossword.service.CrosswordService;
import io.botle.game.crossword.web.dto.CrosswordSaveRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class CrosswordApiController {

    private final CrosswordService crosswordService;

//    @PostMapping("/api/v1/puzzle")
//    public Long Save(@RequestBody PuzzleSaveRequestDto requestDto,
//                     @RequestBody List<QuizSaveRequestDto> quizSaveRequestDtoList) {
//
//        return crosswordService.save(requestDto, quizSaveRequestDtoList);
//    }

    // 다시 만들어본다.
    @PostMapping("/api/v1/puzzle")
    public Long save(@RequestBody CrosswordSaveRequestDto requestDto) {
        return crosswordService.save(requestDto);
    }
}
