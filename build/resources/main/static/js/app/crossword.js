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
      document.getElementsByClassName("crossword-board__item")[0].focus();
      _this.showQuiz(
        document.getElementsByClassName("crossword-board__item")[0]
      );

      // 번호 및 설명
      document
        .querySelector(".crossword-board")
        .addEventListener("focusin", function (e) {
          const input = e.target;
          _this.showQuiz(input);
        });

      document
        .querySelector("#btn-crossword-hint")
        .addEventListener("click", function () {
          _this.showHint();
        });

      let intersection = true;
      // 교차점일 경우 클릭할 때마다 입력칸 바꾸기
      document
        .querySelector(".crossword-board")
        .addEventListener("click", function (e) {
          const targetInput = e.target;

          if (targetInput.classList.contains("crossword-board__item")) {
            // 교차점이 있을 경우 거기도 값을 입력해주자.
            //x, y 어차피 구해와야 하네?
            const targetId = targetInput.getAttribute("id");
            const idArray = targetId.split("-");
            const across = idArray[1] == "across" ? true : false;
            const inputX = parseInt(idArray[2]);
            const inputY = parseInt(idArray[3]);

            let opposite = null;
            if (across) {
              if (
                document.getElementById(`item-down-${inputX}-${inputY}`) != null
              ) {
                // console.log("down 교차점 있음");
                opposite = document.getElementById(
                  `item-down-${inputX}-${inputY}`
                );
              }
            } else {
              if (
                document.getElementById(`item-across-${inputX}-${inputY}`) !=
                null
              ) {
                // console.log("across 교차점 있음");
                opposite = document.getElementById(
                  `item-across-${inputX}-${inputY}`
                );
              }
            }
            if (opposite != null && intersection == true) {
              targetInput.focus();
              intersection = false;
            } else if (opposite != null && intersection == false) {
              opposite.focus();
              intersection = true;
            }
          }
        });

      // 입력했을 시 처리
      document
        .querySelector(".crossword-board")
        .addEventListener("propertychange", function (e) {
          const input = e.target;

          inputLetter(input);
        });
      // document
      //   .querySelector(".crossword-board")
      //   .addEventListener("change", function (e) {
      //     const input = e.target;

      //     inputLetter(input);
      //   });
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
        // console.log(inputVal);

        const checkingBlock = _this.checkCorrectBlock(input);

        // 교차점이 있을 경우 거기도 값을 입력해주자.
        //x, y 어차피 구해와야 하네?
        const id = input.getAttribute("id");
        const idArray = id.split("-");
        const across = idArray[1] == "across" ? true : false;
        const inputX = parseInt(idArray[2]);
        const inputY = parseInt(idArray[3]);

        let oppositeInput = "";
        if (across) {
          if (
            document.querySelector(`#item-down-${inputX}-${inputY}`) != null
          ) {
            document.querySelector(
              `#item-down-${inputX}-${inputY}`
            ).value = inputVal;
            oppositeInput = document.querySelector(
              `#item-down-${inputX}-${inputY}`
            );
          }
        } else {
          if (
            document.querySelector(`#item-across-${inputX}-${inputY}`) != null
          ) {
            document.querySelector(
              `#item-across-${inputX}-${inputY}`
            ).value = inputVal;
            oppositeInput = document.querySelector(
              `#item-across-${inputX}-${inputY}`
            );
          }
        }
        if (oppositeInput != null && oppositeInput != "") {
          _this.checkCorrectBlock(oppositeInput);
        }

        let isBlank = true;
        if (inputVal != "" && checkingBlock) {
          isBlank = _this.findNext(input);
        }
        let result = "";
        if (!isBlank) {
          result = _this.checkVictory();
          _this.stopTime(stTime, endTime, timerStart, min, sec, milisec);
          // console.log(result);
        }
        if (result != "" && result != null) {
          _this.showResult(result);
        }

        // console.log(insert);

        inputVal = null;
      }
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

      const letters = matrixWord.word.split("");
      const upperLetters = matrixWord.word.toUpperCase().split("");
      // console.log(x);
      // console.log(y);
      const across = matrixWord.across;

      const newDiv = document.createElement("div");
      newDiv.style.display = "grid";
      if (across) {
        newDiv.style.gridRow = `${x + 1}/${x + 1}`;
        newDiv.style.gridColumn = `${y + 1}/${y + length + 1}`;

        newDiv.style.gridTemplateColumns = `repeat(${length}, ${
          100 / length
        }%)`;
        newDiv.style.gridTemplateRows = `repeat(1, 100%)`;
        newDiv.setAttribute("id", `across-${i + 1}`);

        // word 집어넣기
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
        newDiv.style.gridTemplateColumns = `repeat(1, 100%)`;
        newDiv.style.gridTemplateRows = `repeat(${length}, ${100 / length}%)`;
        newDiv.setAttribute("id", `down-${i + 1}`);

        // word 집어넣기

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
      newDiv.setAttribute("class", "crossword-board__block");
      newDiv.setAttribute("data-answer", matrixWord.word);
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

      // 현재 문제의 번호도 입력해놓기
    }
    crosswordBoard.appendChild(newLabelDiv);
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

  findNext: function (input) {
    // 먼저 그 블록에서 자식들 찾기
    const block = input.parentNode;
    const siblings = block.childNodes;
    let indexThis;
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (input.getAttribute("id") == sibling.getAttribute("id")) {
        indexThis = i;
      }
    }
    for (let i = indexThis; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling.value == "") {
        sibling.focus();
        return true;
      } else if (i == siblings.length - 1 && sibling.value != "") {
        const anotherBlock = block.nextSibling;
        // console.log(anotherBlock);
        if (
          anotherBlock != null &&
          anotherBlock.classList.contains("crossword-board__item")
        ) {
          this.findNext(anotherBlock);
        } else {
          const wholeInputs = document.getElementsByClassName(
            "crossword-board__item"
          );
          for (let j = 0; j < wholeInputs.length; j++) {
            inputOne = wholeInputs[j];
            if (inputOne.value == "") {
              inputOne.focus();
              return true;
            }
          }
          return false;
        }
      }
    }
  },
  checkCorrectBlock: function (input) {
    const block = input.parentNode;

    // console.log(block);
    const totalInputs = block.childNodes;
    let blankInputs = [];
    let correctInputs = [];
    let incorrectInputs = [];
    for (let i = 0; i < totalInputs.length; i++) {
      const input = totalInputs[i];
      const inputValue = input.value.trim();

      const inputValid = new RegExp(input.pattern);
      if (inputValue == "") {
        blankInputs.push(input);
      } else if (inputValid.test(inputValue)) {
        correctInputs.push(input);
      } else {
        incorrectInputs.push(input);
      }

      // if(input.value == "" || input.classList))
    }

    if (correctInputs.length + incorrectInputs.length == totalInputs.length) {
      if (correctInputs.length == totalInputs.length) {
        // 확장성을 위해

        for (let i = 0; i < correctInputs.length; i++) {
          correctInputs[i].classList.add(
            "crossword-board__item-letter-correct"
          );
          if (
            correctInputs[i].classList.contains(
              "crossword-board__item-letter-incorrect"
            )
          ) {
            correctInputs[i].classList.remove(
              "crossword-board__item-letter-incorrect"
            );
          }
        }
        return true;
      } else {
        console.log(correctInputs);
        console.log(incorrectInputs);
        for (let i = 0; i < correctInputs.length; i++) {
          correctInputs[i].classList.add(
            "crossword-board__item-letter-incorrect"
          );
          if (
            correctInputs[i].classList.contains(
              "crossword-board__item-letter-correct"
            )
          ) {
            correctInputs[i].classList.remove(
              "crossword-board__item-letter-correct"
            );
          }
        }
        for (let i = 0; i < incorrectInputs.length; i++) {
          incorrectInputs[i].classList.add(
            "crossword-board__item-letter-incorrect"
          );
          if (
            incorrectInputs[i].classList.contains(
              "crossword-board__item-letter-correct"
            )
          ) {
            incorrectInputs[i].classList.remove(
              "crossword-board__item-letter-correct"
            );
          }
        }
        return false;
      }
    } else {
      if (
        input.classList.contains("crossword-board__item-letter-correct") ||
        input.classList.contains("crossword-board__item-letter-incorrect")
      ) {
        // for (let i = 0; i < correctInputs.length; i++) {
        //   correctInputs[i].classList.add(
        //     "crossword-board__item-letter-correct"
        //   );
        //   if (
        //     correctInputs[i].classList.contains(
        //       "crossword-board__item-letter-incorrect"
        //     )
        //   ) {
        //     correctInputs[i].classList.remove(
        //       "crossword-board__item-letter-incorrect"
        //     );
        //   }
        // }
        for (let i = 0; i < correctInputs.length; i++) {
          correctInputs[i].classList.add(
            "crossword-board__item-letter-incorrect"
          );
          if (
            correctInputs[i].classList.contains(
              "crossword-board__item-letter-correct"
            )
          ) {
            correctInputs[i].classList.remove(
              "crossword-board__item-letter-correct"
            );
          }
        }
        for (let i = 0; i < incorrectInputs.length; i++) {
          incorrectInputs[i].classList.add(
            "crossword-board__item-letter-incorrect"
          );
          if (
            incorrectInputs[i].classList.contains(
              "crossword-board__item-letter-correct"
            )
          ) {
            incorrectInputs[i].classList.remove(
              "crossword-board__item-letter-correct"
            );
          }
          // incorrectInputs[i].focus();
        }
        for (let i = 0; i < blankInputs.length; i++) {
          // blankInputs[i].classList.add(
          //   "crossword-board__item-letter-incorrect"
          // );
          if (
            blankInputs[i].classList.contains(
              "crossword-board__item-letter-correct"
            )
          ) {
            blankInputs[i].classList.remove(
              "crossword-board__item-letter-correct"
            );
          }
          if (
            blankInputs[i].classList.contains(
              "crossword-board__item-letter-incorrect"
            )
          ) {
            blankInputs[i].classList.remove(
              "crossword-board__item-letter-incorrect"
            );
          }
        }
        return false;
      } else {
        return true;
      }
    }

    // 아무것도 해당안되면 넘겨야하니까 true;
    return true;
  },
  // 승리 여부 확인
  checkVictory: function () {
    const wholeItems = document.getElementsByClassName("crossword-board__item");
    const correctItems = document.getElementsByClassName(
      "crossword-board__item-letter-correct"
    );
    const incorrectItems = document.getElementsByClassName(
      "crossword-board__item-letter-incorrect"
    );

    if (wholeItems.length == correctItems.length) {
      var resultMin = document.getElementById("time-min").innerText;
      var resultSec = document.getElementById("time-sec").innerText;
      var resultMilisec = document.getElementById("time-milisec").innerText;

      return `${resultMin}:${resultSec}.${resultMilisec}`;

      // 아닐 경우 틀린 답으로 이동해주자(예정)
      // window.location.href="/";
    } else {
      incorrectItems[0].focus();
      return null;
    }
  },
  showResult: function (result) {
    alert(`게임 끝!
    푼 시간 : ${result}`);
  },

  // 공사중

  showHint: function () {
    const q_num =
      document.getElementById("quiz-number").innerText.trim() != ""
        ? parseInt(document.getElementById("quiz-number").innerText) - 1
        : -1;
    if (q_num < 0) {
      alert("문제를 선택해주십시오!");
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
        console.log(`${q_num + 1}번 hint: ${hint}`);
        return;
      }
    }
  },
};
crossword.init();
