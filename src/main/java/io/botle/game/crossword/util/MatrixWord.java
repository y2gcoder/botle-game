package io.botle.game.crossword.util;

import java.util.List;

import lombok.Data;

@Data
public class MatrixWord {
	private String word;
	private Boolean across;
	// 단어의 첫 글자의 좌표
	private Integer x;
	private Integer y;
	
	List<MatchingWord> matchingWords;
	
}
