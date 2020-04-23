var index = {
  init: function () {
    var _this = this;

    $("#btn-save").on("click", function () {
      _this.save();
    });
    $("#btn-start").on("click", function () {
      _this.start();
    });

    // 단어 체크 막기
    $(".input_only_en").on("keyup", function () {
      $(this).val(
        $(this)
          .val()
          .replace(/[^a-z]/g, "")
      );
    });

    $("#title").on("keyup", function () {
      var title = $(this).val();
      if (title.length > 0) {
        $.ajax({
          type: "GET",
          url: "/api/v1/puzzle/chk/" + title,
          dataType: "json",
          contentType: "application/json; charset=utf-8",
        })
          .done(function (result) {
            var count = parseInt(result);
            if (count > 0) {
              if ($("#title").hasClass("is-valid")) {
                $("#title").removeClass("is-valid");
              }
              $("#title").addClass("is-invalid");
              $("#title").focus();
              return;
            } else {
              if ($("#title").hasClass("is-invalid")) {
                $("#title").removeClass("is-invalid");
              }
              $("#title").addClass("is-valid");
              return;
            }
          })
          .fail(function (error) {
            alert(JSON.stringify(error));
          });
      } else if (title.length == 0) {
        if ($("#title").hasClass("is-valid")) {
          $("#title").removeClass("is-valid");
        } else if ($("#title").hasClass("is-invalid")) {
          $("#title").removeClass("is-invalid");
        }
      }
    });
  },
  save: function () {
    // 유효성 체크들을 먼저 해볼까?
    var title = $("#title").val();
    if (title == "") {
      alert("퍼즐의 제목을 입력해주세요!");
      $("#title").focus();
      return;
    }
    var category_grade = $("#category_grade").val();

    if (category_grade == null || category_grade == "") {
      alert("학년을 선택해주세요!");
      $("#category_grade").focus();
      return;
    }
    var category_subject = $("#category_subject").val();
    // console.log(category_subject);
    if (category_subject == null || category_subject == "") {
      category_subject = "영어";
    }
    var p_desc = $("#p_desc").val();
    if (p_desc == "") {
      p_desc = "설명 없음";
    }
    var p_keyword = $("#p_keyword").val();
    if (p_keyword == "") {
      p_keyword = "test";
    }

    var quizSaveRequestDtoList = [];
    for (var i = 0; i < 10; i++) {
      var quizSaveRequestDto = {};
      var word = $("#word_" + i).val();
      var q_desc = $("#desc_" + i).val();
      // console.log(word.length);
      if (word != "" && (word.length < 3 || word.length > 9)) {
        alert("단어의 길이는 3~9자만 가능합니다.");
        $("#word_" + i).focus();
        return;
      }
      if (i < 5 && (word == "" || q_desc == "")) {
        alert("단어와 설명은 최소 5개를 입력해주세요!");
        if (word == "") {
          $("#word_" + i).focus();
          return;
        } else if (q_desc == "") {
          $("#desc_" + i).focus();
          return;
        }
      }

      var hint = $("#hint_" + i).val();
      if (hint == "") {
        hint = "힌트 없음";
      }
      var q_keyword = $("#keyword_" + i).val();
      if (q_keyword == "") {
        q_keyword = "test";
      }

      quizSaveRequestDto["word"] = word;
      quizSaveRequestDto["q_desc"] = q_desc;
      quizSaveRequestDto["hint"] = hint;
      quizSaveRequestDto["q_keyword"] = q_keyword;

      quizSaveRequestDtoList.push(quizSaveRequestDto);
    }

    var data = {
      title: title,
      category_grade: category_grade,
      category_subject: category_subject,
      p_desc: p_desc,
      p_keyword: p_keyword,
      quizSaveRequestDtoList: quizSaveRequestDtoList,
    };
    $.ajax({
      type: "POST",
      url: "/api/v1/puzzle",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
    })
      .done(function () {
        alert("퍼즐이 등록되었습니다.");
        window.location.href = "/";
      })
      .fail(function (error) {
        alert(JSON.stringify(error));
      });
  },
  start: function () {
    var p_seq = $("#puzzle_title").val();
    if (p_seq == null || p_seq == "") {
      alert("게임을 선택하고 시작버튼을 눌러주세요!");
      $("#puzzle_title").focus();
      return;
    }
    window.location.href = "/puzzle/" + p_seq;
  },
};
index.init();
