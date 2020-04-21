var crossword = {
  init: function () {
    var _this = this;

    if (puzzle) {
      /* 초기화 후 만들자 */
      $(".crossword-board").html("");
      _this.paintPuzzle(puzzle);
    }
  },
  paintPuzzle: function (puzzle) {
    console.log(puzzle);
    /**
     * puzzle.info == crosswordResponseDto;
     * puzzle.matrix == board 자체
     * puzzle.matrixWords == board의 단어들과 좌표값 넣어 놓음.
     */
    const crosswordBoard = document.getElementsByClassName(
      "crossword-board"
    )[0];
    var matrix = puzzle.matrix;
    var matrixWords = puzzle.matrixWords;
    console.log(matrix);
    // puzzle 그리기부터
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        console.log(`${i}, ${j} : ${matrix[i][j]}`);

        // 값이 없을 때
        if (matrix[i][j] == null || matrix[i][j] == "null") {
          const newSpan = document.createElement("span");
          newSpan.setAttribute("class", `crossword-board__item--blank`);
          newSpan.setAttribute("id", `item-${i}-${j}`);
          crosswordBoard.appendChild(newSpan);
          // 값이 있을 때
        } else {
          const newInput = document.createElement("input");

          var letter = matrix[i][j];
          var upperLetter = letter.toUpperCase();

          newInput.setAttribute("id", `item-${i}-${j}`);
          newInput.setAttribute("class", `crossword-board__item`);
          newInput.setAttribute("type", "text");
          newInput.setAttribute("minlength", "1");
          newInput.setAttribute("maxlength", "1");
          newInput.setAttribute("pattern", `^[${letter}${upperLetter}]{1}$`);
          newInput.setAttribute("required", "required");

          crosswordBoard.appendChild(newInput);
        }
      }
    }
    const newLabelDiv = document.createElement("div");
    newLabelDiv.setAttribute(
      "class",
      "crossword-board crossword-board--labels"
    );

    // 라벨도 붙여보자
    for (var i = 0; i < matrixWords.length; i++) {
      var matrixWord = matrixWords[i];
      var x = matrixWord["x"];
      var y = matrixWord["y"];
      var num = i + 1;
      const newLabelText = document.createElement("span");
      newLabelText.setAttribute("class", "cross-board__item-label-text");
      newLabelText.innerText = num;

      const newLabelSpan = document.createElement("span");
      newLabelSpan.setAttribute("id", `label-${num}`);
      newLabelSpan.setAttribute(
        "class",
        `crossword-board__item-label crossword-board__item-label-grid-row-${x} crossword-board__item-label-grid-col-${y}`
      );
      newLabelSpan.appendChild(newLabelText);
      newLabelDiv.appendChild(newLabelSpan);
    }
    crosswordBoard.appendChild(newLabelDiv);
  },
};
crossword.init();
