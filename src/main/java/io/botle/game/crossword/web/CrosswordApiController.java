package io.botle.game.crossword.web;

import io.botle.game.crossword.service.CrosswordService;
import io.botle.game.crossword.web.dto.CrosswordResponseDto;
import io.botle.game.crossword.web.dto.CrosswordSaveRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class CrosswordApiController {
    private final CrosswordService crosswordService;

    // 다시 만들어본다.
    @PostMapping("/api/v1/puzzle")
    public Long save(@RequestBody CrosswordSaveRequestDto requestDto) {
        return crosswordService.save(requestDto);
    }

//    @PutMapping("/api/v1/puzzle/{p_seq}")
//    public Long update(@PathVariable Long p_seq,
//                       @RequestBody CrosswordUpdateRequestDto requestDto) {
//        return crosswordService.update(p_seq, requestDto);
//    }

//    @GetMapping("/api/v1/puzzle")
//    public List<CrosswordResponseDto> findAllDesc () {
//        return crosswordService.findAllDesc();
//    }
}
