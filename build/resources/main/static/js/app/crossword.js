var crossword = {
  init: function () {
    var _this = this;

    if (puzzle) {
      /* 초기화 후 만들자 */
      $(".crossword-board").html("");
      _this.paintPuzzle(puzzle);

      var inputVal = "";
      $(".crossword-board").on(
        "propertychange change keyup paste",
        `input[id^="item-"]`,
        function () {
          var idVal = $(this).attr("id");
          var idArray = idVal.split("-");
          var x = parseInt(idArray[1]);
          var y = parseInt(idArray[2]);

          var currentVal = $(this).val().trim();
          if (currentVal == inputVal) {
            return;
          }
          inputVal = currentVal.trim();

          var across = $(this).attr("across-word") ? true : false;
          var word = $(this).attr("across-word")
            ? $(this).attr("across-word")
            : $(this).attr("down-word");

          // down으로 쓰고 내려올 때
          if (
            x - 1 > 0 &&
            $(`#item-${x - 1}-${y}`).is("input") &&
            $(`#item-${x - 1}-${y}`)
              .val()
              .trim() != "" &&
            x + 1 < 12 &&
            $(`#item-${x + 1}-${y}`).is("input") &&
            $(`#item-${x + 1}-${y}`)
              .val()
              .trim() == ""
          ) {
            across = false;
            word = $(this).attr("down-word");
          }

          // console.log(`x: ${x}, y: ${y}`);
          // 여기부터 뒤로 넘어가는 것

          if (inputVal != "") {
            console.log(`inputVal:${inputVal}끝`);
            // 한 글자씩 체크
            if ($(`#item-${x}-${y}`).is(":valid")) {
              if (
                $(`#item-${x}-${y}`).hasClass(
                  "crossword-board__item-letter-incorrect"
                )
              ) {
                $(`#item-${x}-${y}`).removeClass(
                  "crossword-board__item-letter-incorrect"
                );
              }
              $(`#item-${x}-${y}`).addClass(
                "crossword-board__item-letter-correct"
              );
            } else {
              if (
                $(`#item-${x}-${y}`).hasClass(
                  "crossword-board__item-letter-correct"
                )
              ) {
                $(`#item-${x}-${y}`).removeClass(
                  "crossword-board__item-letter-correct"
                );
              }
              $(`#item-${x}-${y}`).addClass(
                "crossword-board__item-letter-incorrect"
              );
            }

            _this.checkVictory();

            // 넘어가기

            // if (across) {
            //   // console.log(`x = ${x}, y = ${y + 1}`);
            //   // console.log($(`#item-${x}-${y + 1}`).is("input"));
            //   if ($(`#item-${x}-${y + 1}`).is("input")) {
            //     //값이 있을 경우 다음으로 넘어가자.
            //     var nextVal = $(`#item-${x}-${y + 1}`)
            //       .val()
            //       .trim();
            //     // console.log(nextVal);

            //     if (
            //       nextVal != "" &&
            //       y + 2 < 12 &&
            //       $(`#item-${x}-${y + 2}`).is("input")
            //     ) {
            //       // coneole.log("실행");
            //       $(`#item-${x}-${y + 2}`).focus();
            //       inputVal = "";
            //     } else if (
            //       nextVal != "" &&
            //       y + 2 < 12 &&
            //       !$(`#item-${x}-${y + 2}`).is("input")
            //     ) {
            //       // 여기서 한 줄 체크

            //       // 다음 문제 번호로 넘어가기.
            //       var current_q_num = parseInt($(this).attr("across-num-end"));

            //       for (var i = 0; i < 12; i++) {
            //         for (var j = 0; j < 12; j++) {
            //           var q_num = $(`#item-${i}-${j}`).attr("across-num-start")
            //             ? parseInt(
            //                 $(`#item-${i}-${j}`).attr("across-num-start")
            //               )
            //             : parseInt($(`#item-${i}-${j}`).attr("down-num-start"));

            //           if (q_num == current_q_num + 1) {
            //             $(`#item-${i}-${j}`).focus();
            //             inputVal = "";
            //           }
            //         }
            //       }
            //     } else {
            //       $(`#item-${x}-${y + 1}`).focus();
            //       inputVal = "";
            //     }
            //   } else {
            //     // 여기서 한 줄 체크
            //     // _this.checkAnswer();
            //     // console.log(`word : ${word}`);
            //     // // 가로니까.
            //     // var wholeItems = document.getElementsByClassName(
            //     //   "crossword-board__item"
            //     // );
            //     // var wordItems = [];
            //     // for (var i = 0; i < wholeItems.length; i++) {
            //     //   var wholeItemsWord = wholeItems[i].getAttribute(
            //     //     "across-word"
            //     //   );
            //     //   if (wholeItemsWord == word) {
            //     //     wordItems.push(wholeItems[i]);
            //     //   }
            //     // }
            //     // console.log(wordItems);

            //     // 다음 문제 번호로 넘어가기.
            //     var current_q_num = parseInt($(this).attr("across-num-end"));

            //     for (var i = 0; i < 12; i++) {
            //       for (var j = 0; j < 12; j++) {
            //         var q_num = $(`#item-${i}-${j}`).attr("across-num-start")
            //           ? parseInt($(`#item-${i}-${j}`).attr("across-num-start"))
            //           : parseInt($(`#item-${i}-${j}`).attr("down-num-start"));

            //         if (q_num == current_q_num + 1) {
            //           $(`#item-${i}-${j}`).focus();
            //           inputVal = "";
            //         }
            //       }
            //     }
            //   }
            // } else {
            //   if ($(`#item-${x + 1}-${y}`).is("input")) {
            //     var nextVal = $(`#item-${x + 1}-${y}`)
            //       .val()
            //       .trim();
            //     console.log(`x:${x + 1}, y:${y}, nextVal:${nextVal}`);
            //     if (
            //       nextVal != "" &&
            //       x + 2 < 12 &&
            //       $(`#item-${x + 2}-${y}`).is("input")
            //     ) {
            //       $(`#item-${x + 2}-${y}`).focus();
            //       inputVal = "";
            //     } else if (
            //       nextVal != "" &&
            //       x + 2 < 12 &&
            //       !$(`#item-${x + 2}-${y}`).is("input")
            //     ) {
            //       // 여기서 한 줄 체크

            //       // 다음 문제 번호로 넘어가기.
            //       var current_q_num = parseInt($(this).attr("down-num-end"));

            //       for (var i = 0; i < 12; i++) {
            //         for (var j = 0; j < 12; j++) {
            //           var q_num = $(`#item-${i}-${j}`).attr("across-num-start")
            //             ? parseInt(
            //                 $(`#item-${i}-${j}`).attr("across-num-start")
            //               )
            //             : parseInt($(`#item-${i}-${j}`).attr("down-num-start"));

            //           if (q_num == current_q_num + 1) {
            //             $(`#item-${i}-${j}`).focus();
            //             inputVal = "";
            //           }
            //         }
            //       }
            //     } else {
            //       $(`#item-${x + 1}-${y}`).focus();
            //       inputVal = "";
            //     }
            //   } else {
            //     // 여기서 한 줄 체크

            //     // 다음 문제 번호로 넘어가기.
            //     var current_q_num = parseInt($(this).attr("down-num-end"));

            //     for (var i = 0; i < 12; i++) {
            //       for (var j = 0; j < 12; j++) {
            //         var q_num = $(`#item-${i}-${j}`).attr("across-num-start")
            //           ? parseInt($(`#item-${i}-${j}`).attr("across-num-start"))
            //           : parseInt($(`#item-${i}-${j}`).attr("down-num-start"));

            //         if (q_num == current_q_num + 1) {
            //           $(`#item-${i}-${j}`).focus();
            //           inputVal = "";
            //         }
            //       }
            //     }
            //   }
            // }
          } else {
            $(`#item-${x}-${y}`).removeClass(
              "crossword-board__item-letter-incorrect"
            );
            $(`#item-${x}-${y}`).removeClass(
              "crossword-board__item-letter-correct"
            );
          }
        }
      );
      var word = "";
      $(".crossword-board").on(
        "click focus",
        `input[id^="item-"]`,
        function () {
          var idVal = $(this).attr("id");
          var idArray = idVal.split("-");
          var x = parseInt(idArray[1]);
          var y = parseInt(idArray[2]);

          // 내용 떠야지
          var targetWord = $(this).attr("across-word")
            ? $(this).attr("across-word")
            : $(this).attr("down-word");

          // down으로 쓰고 내려올 때
          if (
            x - 1 > 0 &&
            $(`#item-${x - 1}-${y}`).is("input") &&
            $(`#item-${x - 1}-${y}`)
              .val()
              .trim() != "" &&
            x + 1 < 12 &&
            $(`#item-${x + 1}-${y}`).is("input") &&
            $(`#item-${x + 1}-${y}`)
              .val()
              .trim() == ""
          ) {
            targetWord = $(this).attr("down-word");
          }
          if (targetWord == word) {
            return;
          }
          word = targetWord;

          _this.showQuiz(word);
        }
      );
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
        // console.log(`${i}, ${j} : ${matrix[i][j]}`);

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
      var word = matrixWord["word"];
      var length = word.length;
      var across = matrixWord["across"];

      const newLabelText = document.createElement("span");
      newLabelText.setAttribute("class", "cross-board__item-label-text");
      newLabelText.innerText = num;

      const newLabelSpan = document.createElement("span");
      newLabelSpan.setAttribute("id", `label-${num}`);
      newLabelSpan.setAttribute(
        "class",
        `crossword-board__item-label crossword-board__item-label-grid-row-${x} crossword-board__item-label-grid-col-${y}`
      );
      newLabelSpan.setAttribute("data-word", word);
      newLabelSpan.appendChild(newLabelText);
      newLabelDiv.appendChild(newLabelSpan);

      // 가로 / 세로에 따라 하기
      if (across) {
        for (var j = y; j < y + length; j++) {
          if (j == y) {
            $(`#item-${x}-${j}`).attr("across-num-start", num);
          }
          // item-i-j에 word넣기
          $(`#item-${x}-${j}`).attr("across-word", word);
          if (j != y) {
            $(`#item-${x}-${j}`).attr("across-num-end", num);
          }
        }
      } else {
        for (var j = x; j < x + length; j++) {
          if (j == x) {
            $(`#item-${j}-${y}`).attr("down-num-start", num);
          }
          $(`#item-${j}-${y}`).attr("down-word", word);

          if (j != x) {
            $(`#item-${j}-${y}`).attr("down-num-end", num);
          }
        }
      }

      // 현재 문제의 번호도 입력해놓기
    }
    crosswordBoard.appendChild(newLabelDiv);
  },
  showQuiz: function (word) {
    // 번호 찾기 / 넣기
    for (var i = 0; i < puzzle.matrixWords.length; i++) {
      var matrixWord = puzzle.matrixWords[i];
      var targetWord = matrixWord["word"];
      if (targetWord == word) {
        var across = matrixWord["across"];
        var isAcross = across == true ? "across" : "down";
        // console.log(isAcross);
        var num = i + 1;

        $("#quiz-across").html(isAcross);
        $("#quiz-number").html(num);
      }
    }
    // 설명 찾기 / 넣기
    var quizzes = puzzle.info.quizzes;
    for (var i = 0; i < quizzes.length; i++) {
      var quiz = quizzes[i];
      if (word == quiz.word) {
        var desc = quiz.q_desc;
        $("#quiz-desc").html(desc);
      }
    }
  },
  // 승리 여부 확인
  checkVictory: function () {
    var wholeItems = $(".crossword-board__item");
    var correctItems = $(".crossword-board__item-letter-correct");
    if (wholeItems.length == correctItems.length) {
      alert("게임 끝!");
      // 아닐 경우 틀린 답으로 이동해주자(예정)
    } else {
    }
  },
};
crossword.init();
