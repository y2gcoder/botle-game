var crossword = {
  init: function () {
    var _this = this;

    if (puzzle) {
      console.log(puzzle);
      /**
       * puzzle.info == crosswordResponseDto;
       * puzzle.matrix == board 자체
       * puzzle.matrixWords == board의 단어들과 좌표값 넣어 놓음.
       */

      // 시간 관련 변수들
      let stTime = 0;
      let endTime = 0;
      let timerStart;

      let min;
      let sec;
      let milisec;

      /* 초기화 후 만들자 */
      $(".crossword-board").html("");
      _this.paintPuzzle(puzzle);

      timerStart = _this.startTime(
        stTime,
        endTime,
        timerStart,
        min,
        sec,
        milisec
      );

      // 그전의 처음 그리드
      let directionIndexItem;

      let inputVal;
      $(".crossword-board").on(
        "propertychange change keyup paste",
        `input[id^="item-"]`,
        function () {
          var idVal = $(this).attr("id");
          var idArray = idVal.split("-");
          var x = parseInt(idArray[1]);
          var y = parseInt(idArray[2]);

          // let current_num = _this.findQ_num(x, y);
          // const index_item = _this.findIndexItem(current_num);

          var currentVal = $(this).val().trim();
          if (currentVal == inputVal) {
            return;
          }
          inputVal = currentVal.trim();

          let across;
          let word;

          const currentItem = document.getElementById(`item-${x}-${y}`);

          if (
            currentItem.hasAttribute("across-word") &&
            !currentItem.hasAttribute("down-word")
          ) {
            across = true;
            word = currentItem.getAttribute("across-word");
          } else if (
            !currentItem.hasAttribute("across-word") &&
            currentItem.hasAttribute("down-word")
          ) {
            across = false;
            word = currentItem.getAttribute("down-word");
          } else if (
            currentItem.hasAttribute("across-word") &&
            currentItem.hasAttribute("down-word")
          ) {
          }

          // if (
          //   (currentItem.getAttribute("across-word") != null ||
          //     currentItem.getAttribute("across-word") != "") &&
          //   (currentItem.getAttribute("down-word") == null ||
          //     currentItem.getAttribute("down-word") == "")
          // ) {
          //   across = true;
          //   word = currentItem.getAttribute("across-word");
          //   if (
          //     y - 1 >= 0 &&
          //     document
          //       .getElementById(`item-${x}-${y - 1}`)
          //       .classList.contains("crossword-board__item")
          //   ) {
          //     prevAcrossItem = document.getElementById(`item-${x}-${y - 1}`);
          //   }
          //   if (
          //     y + 1 < 12 &&
          //     document
          //       .getElementById(`item-${x}-${y + 1}`)
          //       .classList.contains("crossword-board__item")
          //   ) {
          //     nextAcrossItem = document.getElementById(`item-${x}-${y + 1}`);
          //   }
          // } else if (
          //   (currentItem.getAttribute("across-word") == null ||
          //     currentItem.getAttribute("across-word") == "") &&
          //   (currentItem.getAttribute("down-word") != null ||
          //     currentItem.getAttribute("down-word") != "")
          // ) {
          //   across = false;
          //   word = currentItem.getAttribute("down-word");
          //   if (
          //     x - 1 >= 0 &&
          //     document
          //       .getElementById(`item-${x - 1}-${y}`)
          //       .classList.contains("crossword-board__item")
          //   ) {
          //     prevDownItem = document.getElementById(`item-${x - 1}-${y}`);
          //   }
          //   if (
          //     x + 1 < 12 &&
          //     document
          //       .getElementById(`item-${x + 1}-${y}`)
          //       .classList.contains("crossword-board__item")
          //   ) {
          //     nextDownItem = document.getElementById(`item-${x + 1}-${y}`);
          //   }
          // } else if (
          //   // 가로 세로 다 있음.
          //   (currentItem.getAttribute("across-word") != null ||
          //     currentItem.getAttribute("across-word") != "") &&
          //   (currentItem.getAttribute("down-word") != null ||
          //     currentItem.getAttribute("down-word") != "")
          // ) {
          //   if (
          //     y - 1 >= 0 &&
          //     document
          //       .getElementById(`item-${x}-${y - 1}`)
          //       .classList.contains("crossword-board__item")
          //   ) {
          //     prevAcrossItem = document.getElementById(`item-${x}-${y - 1}`);
          //   }
          //   if (
          //     y + 1 < 12 &&
          //     document
          //       .getElementById(`item-${x}-${y + 1}`)
          //       .classList.contains("crossword-board__item")
          //   ) {
          //     nextAcrossItem = document.getElementById(`item-${x}-${y + 1}`);
          //   }
          //   if (
          //     x - 1 >= 0 &&
          //     document
          //       .getElementById(`item-${x - 1}-${y}`)
          //       .classList.contains("crossword-board__item")
          //   ) {
          //     prevDownItem = document.getElementById(`item-${x - 1}-${y}`);
          //   }
          //   if (
          //     x + 1 < 12 &&
          //     document
          //       .getElementById(`item-${x + 1}-${y}`)
          //       .classList.contains("crossword-board__item")
          //   ) {
          //     nextDownItem = document.getElementById(`item-${x + 1}-${y}`);
          //   }

          //   // undefined에 따라서 정하자
          //   if (prevAcrossItem == undefined) {
          //     if (
          //       nextAcrossItem.value == "" &&
          //       prevDownItem.value == "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       nextAcrossItem.value == "" &&
          //       prevDownItem.value != "" &&
          //       nextDownItem.value != ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       nextAcrossItem.value == "" &&
          //       prevDownItem.value != "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = false;
          //       word = currentItem.getAttribute("down-word");
          //     } else if (
          //       nextAcrossItem.value != "" &&
          //       prevDownItem.value != "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = false;
          //       word = currentItem.getAttribute("down-word");
          //     } else {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     }
          //   } else if (nextAcrossItem == undefined) {
          //     if (
          //       prevAcrossItem.value == "" &&
          //       prevDownItem.value == "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       prevDownItem.value == "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       prevDownItem.value != "" &&
          //       nextDownItem.value != ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value == "" &&
          //       prevDownItem.value != "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = false;
          //       word = currentItem.getAttribute("down-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       prevDownItem.value != "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = false;
          //       word = currentItem.getAttribute("down-word");
          //     } else {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     }
          //   } else if (prevDownItem == undefined) {
          //     if (
          //       prevAcrossItem.value == "" &&
          //       nextAcrossItem.value == "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       nextAcrossItem.value == "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       nextAcrossItem.value == "" &&
          //       nextDownItem.value != ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       nextAcrossItem.value != "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = false;
          //       word = currentItem.getAttribute("down-word");
          //     } else {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     }
          //   } else if (nextDownItem == undefined) {
          //     if (
          //       prevAcrossItem.value == "" &&
          //       nextAcrossItem.value == "" &&
          //       prevDownItem.value == ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       nextAcrossItem.value == "" &&
          //       prevDownItem.value == ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       nextAcrossItem.value == "" &&
          //       prevDownItem.value != ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value == "" &&
          //       nextAcrossItem.value == "" &&
          //       prevDownItem.value != ""
          //     ) {
          //       across = false;
          //       word = currentItem.getAttribute("down-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       nextAcrossItem.value != "" &&
          //       prevDownItem.value != ""
          //     ) {
          //       across = false;
          //       word = currentItem.getAttribute("down-word");
          //     } else {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     }
          //   } else {
          //     if (
          //       prevAcrossItem.value == "" &&
          //       nextAcrossItem.value == "" &&
          //       prevDownItem.value == "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       nextAcrossItem.value == "" &&
          //       prevDownItem.value == "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       nextAcrossItem.value == "" &&
          //       prevDownItem.value != "" &&
          //       nextDownItem.value != ""
          //     ) {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     } else if (
          //       prevAcrossItem.value == "" &&
          //       nextAcrossItem.value == "" &&
          //       prevDownItem.value != "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = false;
          //       word = currentItem.getAttribute("down-word");
          //     } else if (
          //       prevAcrossItem.value != "" &&
          //       nextAcrossItem.value != "" &&
          //       prevDownItem.value != "" &&
          //       nextDownItem.value == ""
          //     ) {
          //       across = false;
          //       word = currentItem.getAttribute("down-word");
          //     } else {
          //       across = true;
          //       word = currentItem.getAttribute("across-word");
          //     }
          //   }
          // }
          // console.log(prevAcrossItem);
          // console.log(prevDownItem);
          // console.log(nextAcrossItem);
          // console.log(nextDownItem);
          // console.log(`x: ${x}, y: ${y}`);
          // 여기부터 정답 체크
          console.log(`inputVal:${inputVal}끝`);

          if (inputVal != "") {
            // 한 글자씩 체크
            _this.checkInput(inputVal, x, y);

            const result = _this.checkVictory();
            // console.log(result);

            if (result != null) {
              _this.stopTime(stTime, endTime, timerStart, min, sec, milisec);
              _this.showResult(result);
            }
            // 시작점의 좌표, 단어 길이, 현재 좌표를 가지고 다음 커서 위치를 정할까?
            // 다음 퀴즈로 넘어가는 flag
            let nextQuiz = false;
            let q_num;
            // 넘어가기
            if (across) {
              q_num = currentItem.getAttribute("across-num-end")
                ? parseInt(currentItem.getAttribute("across-num-end"))
                : parseInt(currentItem.getAttribute("across-num-start"));
              // 시작점 좌표 구하기
              const indexItem = _this.findIndexItem(q_num);
              // console.log(indexItem);
              const indexItemId = indexItem.getAttribute("id");
              const indexItemIdArray = indexItemId.split("-");
              const indexX = parseInt(indexItemIdArray[1]);
              const indexY = parseInt(indexItemIdArray[2]);
              for (let i = indexY; i < indexY + word.length; i++) {
                var targetItem = document.getElementById(`item-${x}-${i}`);
                if (targetItem.value == "") {
                  targetItem.focus();
                  break;
                } else {
                  if (i == indexY + word.length - 1) {
                    nextQuiz = true;
                  }
                  continue;
                }
              }
            } else {
              q_num = currentItem.getAttribute("down-num-end")
                ? parseInt(currentItem.getAttribute("down-num-end"))
                : parseInt(currentItem.getAttribute("down-num-start"));
              // 시작점 좌표 구하기
              const indexItem = _this.findIndexItem(q_num);
              const indexItemId = indexItem.getAttribute("id");
              const indexItemIdArray = indexItemId.split("-");
              const indexX = parseInt(indexItemIdArray[1]);
              const indexY = parseInt(indexItemIdArray[2]);
              for (let i = indexX; i < indexX + word.length; i++) {
                var targetItem = document.getElementById(`item-${i}-${y}`);
                if (targetItem.value == "") {
                  targetItem.focus();
                  break;
                } else {
                  if (i == indexX + word.length - 1) {
                    nextQuiz = true;
                  }
                  continue;
                }
              }
            }
            // 다음 단어로 넘어가기
            if (nextQuiz) {
              if (q_num < puzzle.matrixWords.length) {
                const nextIndexItem = _this.findIndexItem(q_num + 1);
                nextIndexItem.focus();
              } else {
                const firstIndexItem = _this.findIndexItem(1);
                firstIndexItem.focus();
              }
              nextQuiz = false;
            }
          } else {
            $(`#item-${x}-${y}`).removeClass(
              "crossword-board__item-letter-incorrect"
            );
            $(`#item-${x}-${y}`).removeClass(
              "crossword-board__item-letter-correct"
            );
          }
          inputVal = null;
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

      document
        .querySelector(".crossword-board")
        .addEventListener("focusout", function (e) {
          const input = e.target;
          const inputVal = input.value.trim();
          if (inputVal == "") {
            input.classList.remove("crossword-board__item-letter-incorrect");
            input.classList.remove("crossword-board__item-letter-correct");
          } else {
            //
          }
        });

      document
        .querySelector("#btn-crossword-hint")
        .addEventListener("click", function (e) {
          _this.showHint();
        });
    }
  },
  paintPuzzle: function (puzzle) {
    const crosswordBoard = document.getElementsByClassName(
      "crossword-board"
    )[0];
    var matrix = puzzle.matrix;
    var matrixWords = puzzle.matrixWords;
    for (let i = 0; i < matrixWords.length; i++) {
      const matrixWord = matrixWords[i];
      const length = matrixWord.word.length;
      const x = matrixWord.x;
      const y = matrixWord.y;
      console.log(x);
      console.log(y);
      const across = matrixWord.across;

      const newDiv = document.createElement("div");
      if (across) {
        newDiv.style.gridRow = `${x + 1}/${x + 1}`;
        newDiv.style.gridColumn = `${y + 1}/${y + length + 1}`;
        newDiv.style.display = "grid";
        // newDiv.setAttribute("id", `word_`);
      } else {
        newDiv.style.gridRow = `${x + 1}/${x + length + 1}`;
        newDiv.style.gridColumn = `${y + 1}/${y + 1}`;
        newDiv.style.display = "grid";
      }

      crosswordBoard.appendChild(newDiv);
    }

    // // puzzle 그리기부터
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
        var keyword = `#${quiz.q_keyword}`;

        $("#quiz-desc").html(desc);
        document.getElementById("quiz-keyword").innerText = keyword;
      }
    }
  },
  // 승리 여부 확인
  checkVictory: function () {
    var wholeItems = $(".crossword-board__item");
    var correctItems = $(".crossword-board__item-letter-correct");
    if (wholeItems.length == correctItems.length) {
      var resultMin = document.getElementById("time-min").innerText;
      var resultSec = document.getElementById("time-sec").innerText;
      var resultMilisec = document.getElementById("time-milisec").innerText;

      return `${resultMin}:${resultSec}.${resultMilisec}`;

      // 아닐 경우 틀린 답으로 이동해주자(예정)
      // window.location.href="/";
    } else {
      return null;
    }
  },
  startTime: function (stTime, endTime, timerStart, min, sec, milisec) {
    // 최초 시작
    if (!stTime) {
      stTime = Date.now();
    } else {
      stTime += Date.now() - endTime;
    }

    timerStart = setInterval(function () {
      var nowTime = new Date(Date.now() - stTime);

      min = addZero(nowTime.getMinutes());
      sec = addZero(nowTime.getSeconds());
      milisec = addZero(Math.floor(nowTime.getMilliseconds() / 10));

      document.getElementById("time-min").innerText = min;
      document.getElementById("time-sec").innerText = sec;
      document.getElementById("time-milisec").innerText = milisec;
    }, 1);

    function addZero(num) {
      return num < 10 ? "0" + num : "" + num;
    }

    return timerStart;
  },
  stopTime: function (stTime, endTime, timerStart, min, sec, milisec) {
    if (timerStart) {
      clearInterval(timerStart);
      // console.log("시간 멈추기");
      endTime = Date.now();
      // 초기화
      stTime = 0;
      min = 0;
      sec = 0;
      milisec = 0;

      document.getElementById("time-min").innerText = "00";
      document.getElementById("time-sec").innerText = "00";
      document.getElementById("time-milisec").innerText = "00";
      timerStart = null;
    }
  },
  showResult: function (result) {
    alert(`게임 끝!
    푼 시간 : ${result}`);
  },
  showHint: function () {
    const q_num =
      document.getElementById("quiz-number").innerText.trim() != ""
        ? parseInt(document.getElementById("quiz-number").innerText) - 1
        : -1;
    if (q_num < 0) {
      return;
    }
    const word = puzzle.matrixWords[q_num].word;

    const quizzes = puzzle.info.quizzes;
    for (var i = 0; i < quizzes.length; i++) {
      const quiz = quizzes[i];
      const quizWord = quiz.word;
      // console.log(`찾는 단어 : ${word}, for문 단어 : ${quizWord}`);
      if (word == quizWord) {
        const hint = quiz.hint;
        console.log(`hint: ${hint}`);
        return;
      }
    }
  },
  checkInput: function (inputVal, x, y) {
    if ($(`#item-${x}-${y}`).is(":valid")) {
      if (
        $(`#item-${x}-${y}`).hasClass("crossword-board__item-letter-incorrect")
      ) {
        $(`#item-${x}-${y}`).removeClass(
          "crossword-board__item-letter-incorrect"
        );
      }
      $(`#item-${x}-${y}`).addClass("crossword-board__item-letter-correct");
    } else {
      if (
        $(`#item-${x}-${y}`).hasClass("crossword-board__item-letter-correct")
      ) {
        $(`#item-${x}-${y}`).removeClass(
          "crossword-board__item-letter-correct"
        );
      }
      $(`#item-${x}-${y}`).addClass("crossword-board__item-letter-incorrect");
    }
  },
  findIndexItem: function (num) {
    const wholeItems = document.getElementsByClassName("crossword-board__item");
    for (let i = 0; i < wholeItems.length; i++) {
      const item = wholeItems[i];

      if (
        !item.hasAttribute("across-num-start") &&
        !item.hasAttribute("down-num-start")
      ) {
        continue;
      }
      if (item.hasAttribute("across-num-start")) {
        if (item.getAttribute("across-num-start") == num) {
          return item;
        } else {
          continue;
        }
      }
      if (item.hasAttribute("down-num-start")) {
        if (item.getAttribute("down-num-start") == num) {
          return item;
        } else {
          continue;
        }
      }
    }
  },
  // findQ_num: function (x, y) {
  //   const targetItem = document.getElementById(`item-${x}-${y}`);
  //   if (targetItem.hasAttribute("across-num-start")) {
  //     return parseInt(targetItem.hasAttribute("across-num-start"));
  //   }
  //   if (target)
  // },
};
crossword.init();
