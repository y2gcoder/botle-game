package io.botle.game.crossword.web;

import io.botle.game.crossword.service.CrosswordService;
import io.botle.game.crossword.web.dto.CrosswordResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RequiredArgsConstructor
@Controller
public class IndexController {
    private final CrosswordService crosswordService;

    @GetMapping("/")
    public String index(Model model) throws Exception {
        model.addAttribute("puzzles", crosswordService.findPuzzles());
        return "index";
    }

    @GetMapping("/puzzle/save")
    public String puzzleSave() {
        return "puzzle-save";
    }

    @GetMapping("/puzzle/{p_seq}")
    public String findPuzzleBySeq(@PathVariable Long p_seq, Model model) {
        System.out.println("번호 : "+p_seq);
        CrosswordResponseDto dto = crosswordService.findPuzzleBySeq(p_seq);
        System.out.println("가져온 녀석 제목: "+dto.getTitle());
        model.addAttribute("puzzle", dto);

        return "puzzle-game";
    }


}
