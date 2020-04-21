package io.botle.game.crossword.util;

import lombok.Data;

@Data
public class AvailableSpace {
	private Integer topSpace;
	private Integer rightSpace;
	private Integer bottomSpace;
	private Integer leftSpace;
}
