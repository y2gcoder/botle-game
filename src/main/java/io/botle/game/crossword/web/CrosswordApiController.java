package io.botle.game.crossword.web;

import io.botle.game.crossword.service.CrosswordService;
import io.botle.game.crossword.web.dto.PuzzleSaveRequestDto;
import io.botle.game.crossword.web.dto.QuizSaveRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class CrosswordApiController {

    private final CrosswordService crosswordService;

    @PostMapping("/api/v1/puzzle")
    public Long Save(@RequestBody PuzzleSaveRequestDto requestDto,
                     @RequestBody List<QuizSaveRequestDto> quizSaveRequestDtoList) {

        return crosswordService.save(requestDto, quizSaveRequestDtoList);
    }
}
