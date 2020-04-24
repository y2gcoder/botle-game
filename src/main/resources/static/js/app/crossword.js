const crossword = {
  init: function () {
    const _this = this;

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
      document.querySelector(".crossword-board").innerHTML = "";

      _this.paintPuzzle(puzzle);

      timerStart = _this.startTime(
        stTime,
        endTime,
        timerStart,
        min,
        sec,
        milisec
      );
      // 번호 및 설명
      document
        .querySelector(".crossword-board")
        .addEventListener("focusin", function (e) {
          const input = e.target;
          _this.showQuiz(input);
        });

      // 교차점일 경우 클릭할 때마다 입력칸 바꾸기
      let clickCnt = 0;
      document
        .querySelector(".crossword-board")
        .addEventListener("click", function (e) {
          const input = e.target;
          console.log(`input 바꾸기 : ${input.getAttribute("id")}`);
          const id = input.getAttribute("id");
          const idArray = id.split("-");
          const across = idArray[1] == "across" ? true : false;
          const inputX = parseInt(idArray[2]);
          const inputY = parseInt(idArray[3]);

          if (across) {
            if (
              document.querySelector(`#item-down-${inputX}-${inputY}`) !=
                null &&
              clickCnt == 1
            ) {
              document.querySelector(`#item-down-${inputX}-${inputY}`).focus();
              clickCnt = 0;
              return;
            }
          } else {
            if (
              document.querySelector(`#item-across-${inputX}-${inputY}`) !=
                null &&
              clickCnt == 1
            ) {
              document
                .querySelector(`#item-across-${inputX}-${inputY}`)
                .focus();
              clickCnt = 0;
              return;
            }
          }
          clickCnt++;
        });

      // 입력했을 시 처리
      document
        .querySelector(".crossword-board")
        .addEventListener("propertychange", function (e) {
          const input = e.target;

          inputLetter(input);
        });
      document
        .querySelector(".crossword-board")
        .addEventListener("change", function (e) {
          const input = e.target;

          inputLetter(input);
        });
      document
        .querySelector(".crossword-board")
        .addEventListener("keyup", function (e) {
          const input = e.target;

          inputLetter(input);
        });
      document
        .querySelector(".crossword-board")
        .addEventListener("paste", function (e) {
          const input = e.target;

          inputLetter(input);
        });

      let inputVal;
      // 값 변경 시 체크
      function inputLetter(input) {
        const currentVal = input.value.trim();
        if (currentVal == inputVal) {
          return;
        }
        inputVal = currentVal;
        console.log(inputVal);

        // 교차점이 있을 경우 거기도 값을 입력해주자.
        //x, y 어차피 구해와야 하네?
        const id = input.getAttribute("id");
        const idArray = id.split("-");
        const across = idArray[1] == "across" ? true : false;
        const inputX = parseInt(idArray[2]);
        const inputY = parseInt(idArray[3]);
        const word = input.getAttribute("data-answer");

        if (across) {
          if (
            document.querySelector(`#item-down-${inputX}-${inputY}`) != null
          ) {
            document.querySelector(
              `#item-down-${inputX}-${inputY}`
            ).value = inputVal;
          }
        } else {
          if (
            document.querySelector(`#item-across-${inputX}-${inputY}`) != null
          ) {
            document.querySelector(
              `#item-across-${inputX}-${inputY}`
            ).value = inputVal;
          }
        }

        inputVal = null;
      }

      // $(".crossword-board").on(
      //   "propertychange change keyup paste",
      //   `input[id^="item-"]`,
      //   function () {
      //     var idVal = $(this).attr("id");
      //     var idArray = idVal.split("-");
      //     var x = parseInt(idArray[1]);
      //     var y = parseInt(idArray[2]);

      //     // let current_num = _this.findQ_num(x, y);
      //     // const index_item = _this.findIndexItem(current_num);

      //     var currentVal = $(this).val().trim();
      //     if (currentVal == inputVal) {
      //       return;
      //     }
      //     inputVal = currentVal.trim();

      //     let across;
      //     let word;

      //     const currentItem = document.getElementById(`item-${x}-${y}`);

      //     if (
      //       currentItem.hasAttribute("across-word") &&
      //       !currentItem.hasAttribute("down-word")
      //     ) {
      //       across = true;
      //       word = currentItem.getAttribute("across-word");
      //     } else if (
      //       !currentItem.hasAttribute("across-word") &&
      //       currentItem.hasAttribute("down-word")
      //     ) {
      //       across = false;
      //       word = currentItem.getAttribute("down-word");
      //     } else if (
      //       currentItem.hasAttribute("across-word") &&
      //       currentItem.hasAttribute("down-word")
      //     ) {
      //     }

      //     // 여기부터 정답 체크
      //     console.log(`inputVal:${inputVal}끝`);

      //     if (inputVal != "") {
      //       // 한 글자씩 체크
      //       _this.checkInput(inputVal, x, y);

      //       const result = _this.checkVictory();
      //       // console.log(result);

      //       if (result != null) {
      //         _this.stopTime(stTime, endTime, timerStart, min, sec, milisec);
      //         _this.showResult(result);
      //       }
      //       // 시작점의 좌표, 단어 길이, 현재 좌표를 가지고 다음 커서 위치를 정할까?
      //       // 다음 퀴즈로 넘어가는 flag
      //       let nextQuiz = false;
      //       let q_num;
      //       // 넘어가기
      //       if (across) {
      //         q_num = currentItem.getAttribute("across-num-end")
      //           ? parseInt(currentItem.getAttribute("across-num-end"))
      //           : parseInt(currentItem.getAttribute("across-num-start"));
      //         // 시작점 좌표 구하기
      //         const indexItem = _this.findIndexItem(q_num);
      //         // console.log(indexItem);
      //         const indexItemId = indexItem.getAttribute("id");
      //         const indexItemIdArray = indexItemId.split("-");
      //         const indexX = parseInt(indexItemIdArray[1]);
      //         const indexY = parseInt(indexItemIdArray[2]);
      //         for (let i = indexY; i < indexY + word.length; i++) {
      //           var targetItem = document.getElementById(`item-${x}-${i}`);
      //           if (targetItem.value == "") {
      //             targetItem.focus();
      //             break;
      //           } else {
      //             if (i == indexY + word.length - 1) {
      //               nextQuiz = true;
      //             }
      //             continue;
      //           }
      //         }
      //       } else {
      //         q_num = currentItem.getAttribute("down-num-end")
      //           ? parseInt(currentItem.getAttribute("down-num-end"))
      //           : parseInt(currentItem.getAttribute("down-num-start"));
      //         // 시작점 좌표 구하기
      //         const indexItem = _this.findIndexItem(q_num);
      //         const indexItemId = indexItem.getAttribute("id");
      //         const indexItemIdArray = indexItemId.split("-");
      //         const indexX = parseInt(indexItemIdArray[1]);
      //         const indexY = parseInt(indexItemIdArray[2]);
      //         for (let i = indexX; i < indexX + word.length; i++) {
      //           var targetItem = document.getElementById(`item-${i}-${y}`);
      //           if (targetItem.value == "") {
      //             targetItem.focus();
      //             break;
      //           } else {
      //             if (i == indexX + word.length - 1) {
      //               nextQuiz = true;
      //             }
      //             continue;
      //           }
      //         }
      //       }
      //       // 다음 단어로 넘어가기
      //       if (nextQuiz) {
      //         if (q_num < puzzle.matrixWords.length) {
      //           const nextIndexItem = _this.findIndexItem(q_num + 1);
      //           nextIndexItem.focus();
      //         } else {
      //           const firstIndexItem = _this.findIndexItem(1);
      //           firstIndexItem.focus();
      //         }
      //         nextQuiz = false;
      //       }
      //     } else {
      //       $(`#item-${x}-${y}`).removeClass(
      //         "crossword-board__item-letter-incorrect"
      //       );
      //       $(`#item-${x}-${y}`).removeClass(
      //         "crossword-board__item-letter-correct"
      //       );
      //     }
      //     inputVal = null;
      //   }
      // );

      // var word = "";
      // $(".crossword-board").on(
      //   "click focus",
      //   `input[id^="item-"]`,
      //   function () {
      //     var idVal = $(this).attr("id");
      //     var idArray = idVal.split("-");
      //     var x = parseInt(idArray[1]);
      //     var y = parseInt(idArray[2]);

      //     // 내용 떠야지
      //     var targetWord = $(this).attr("across-word")
      //       ? $(this).attr("across-word")
      //       : $(this).attr("down-word");

      //     // down으로 쓰고 내려올 때
      //     if (
      //       x - 1 > 0 &&
      //       $(`#item-${x - 1}-${y}`).is("input") &&
      //       $(`#item-${x - 1}-${y}`)
      //         .val()
      //         .trim() != "" &&
      //       x + 1 < 12 &&
      //       $(`#item-${x + 1}-${y}`).is("input") &&
      //       $(`#item-${x + 1}-${y}`)
      //         .val()
      //         .trim() == ""
      //     ) {
      //       targetWord = $(this).attr("down-word");
      //     }
      //     if (targetWord == word) {
      //       return;
      //     }
      //     word = targetWord;

      //     _this.showQuiz(word);
      //   }
      // );

      // document
      //   .querySelector(".crossword-board")
      //   .addEventListener("focusout", function (e) {
      //     const input = e.target;
      //     const inputVal = input.value.trim();
      //     if (inputVal == "") {
      //       input.classList.remove("crossword-board__item-letter-incorrect");
      //       input.classList.remove("crossword-board__item-letter-correct");
      //     } else {
      //       //
      //     }
      //   });

      // document
      //   .querySelector("#btn-crossword-hint")
      //   .addEventListener("click", function (e) {
      //     _this.showHint();
      //   });
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
      // console.log(x);
      // console.log(y);
      const across = matrixWord.across;

      const newDiv = document.createElement("div");
      if (across) {
        newDiv.style.gridRow = `${x + 1}/${x + 1}`;
        newDiv.style.gridColumn = `${y + 1}/${y + length + 1}`;
        newDiv.style.display = "grid";
        newDiv.style.gridTemplateColumns = `repeat(${length}, ${
          100 / length
        }%)`;
        newDiv.style.gridTemplateRows = `repeat(1, 100%)`;
        newDiv.setAttribute("id", `across-${i + 1}`);
        newDiv.setAttribute("data-answer", matrixWord.word);

        // word 집어넣기
        const letters = matrixWord.word.split("");
        const upperLetters = matrixWord.word.toUpperCase().split("");

        for (let i = 0; i < matrixWord.word.length; i++) {
          const newInput = document.createElement("input");
          const letter = letters[i];
          const upperLetter = upperLetters[i];

          newInput.setAttribute("id", `item-across-${x}-${y + i}`);
          newInput.setAttribute("class", `crossword-board__item`);
          newInput.setAttribute("type", "text");
          newInput.setAttribute("minlength", "1");
          newInput.setAttribute("maxlength", "1");
          newInput.setAttribute("pattern", `^[${letter}${upperLetter}]{1}$`);
          newInput.setAttribute("required", "required");
          newInput.setAttribute("data-answer", matrixWord.word);
          newInput.setAttribute("value", "");

          newDiv.appendChild(newInput);
        }
      } else {
        newDiv.style.gridRow = `${x + 1}/${x + length + 1}`;
        newDiv.style.gridColumn = `${y + 1}/${y + 1}`;
        newDiv.style.display = "grid";
        newDiv.style.gridTemplateColumns = `repeat(1, 100%)`;
        newDiv.style.gridTemplateRows = `repeat(${length}, ${100 / length}%)`;
        newDiv.setAttribute("id", `down-${i + 1}`);
        newDiv.setAttribute("data-answer", matrixWord.word);

        // word 집어넣기
        const letters = matrixWord.word.split("");
        const upperLetters = matrixWord.word.toUpperCase().split("");

        for (let i = 0; i < matrixWord.word.length; i++) {
          const newInput = document.createElement("input");
          const letter = letters[i];
          const upperLetter = upperLetters[i];

          newInput.setAttribute("id", `item-down-${x + i}-${y}`);
          newInput.setAttribute("class", `crossword-board__item`);
          newInput.setAttribute("type", "text");
          newInput.setAttribute("minlength", "1");
          newInput.setAttribute("maxlength", "1");
          newInput.setAttribute("pattern", `^[${letter}${upperLetter}]{1}$`);
          newInput.setAttribute("required", "required");
          newInput.setAttribute("data-answer", matrixWord.word);
          newInput.setAttribute("value", "");

          newDiv.appendChild(newInput);
        }
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

      // 가로 / 세로에 따라 하기 이제 이런거 필요 없음.
      // if (across) {
      //   for (var j = y; j < y + length; j++) {
      //     if (j == y) {
      //       $(`#item-across-${x}-${j}`).attr("across-num-start", num);
      //     }
      //     // item-i-j에 word넣기
      //     $(`#item-${x}-${j}`).attr("across-word", word);
      //     if (j != y) {
      //       $(`#item-${x}-${j}`).attr("across-num-end", num);
      //     }
      //   }
      // } else {
      //   for (var j = x; j < x + length; j++) {
      //     if (j == x) {
      //       $(`#item-${j}-${y}`).attr("down-num-start", num);
      //     }
      //     $(`#item-${j}-${y}`).attr("down-word", word);

      //     if (j != x) {
      //       $(`#item-${j}-${y}`).attr("down-num-end", num);
      //     }
      //   }
      // }

      // 현재 문제의 번호도 입력해놓기
    }
    crosswordBoard.appendChild(newLabelDiv);
  },
  showQuiz: function (input) {
    const block = input.parentNode;
    const blockArray = block.getAttribute("id").split("-");
    const quiz_across = blockArray[0];
    const quiz_number = blockArray[1];

    const word = input.getAttribute("data-answer");

    // 번호 찾기 / 넣기
    document.getElementById("quiz-across").innerText = quiz_across;
    document.getElementById("quiz-number").innerText = quiz_number;

    // 설명 찾기 / 넣기
    const quizzes = puzzle.info.quizzes;
    for (let i = 0; i < quizzes.length; i++) {
      const quiz = quizzes[i];
      if (word == quiz.word) {
        const desc = quiz.q_desc;
        const keyword = `#${quiz.q_keyword}`;

        document.getElementById("quiz-desc").innerText = desc;
        document.getElementById("quiz-keyword").innerText = keyword;
        break;
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
