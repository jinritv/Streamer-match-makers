// UsersAnswers is a dynamic object that stores the answers to the quiz questions.
// Update it as soon as possible (like in the onchange event)
// and the end of the quiz, this is what is sent to our API to calculate the streamer.
var UsersAnswers = {};

// CurrentQuestion represents which question we are on
var CurrentQuestion = 1;

// statistic of scoring result
var ResultStats = {};

var $quizContinueButton, $quizBackButton, $quizRestartButton;

var $quizResultContainer, $streamerRevealContainer;

// This is called when the page is loaded
$(() => {
  // Set default language
  setLanguage(getDefaultLanguage());
  // downloads the site's texts and then the callback to load the rest of the site
  getPageHTML();
});

// loads the rest of the data in JSON form (not rendered html)
function GetRestOfSiteData() {
  $.ajax({
    beforeSend: console.log("getting rest of data"),
    url: "/getQuizData",
    type: "POST",
    data: { language: getLanguage() },
    success: (data) => {
      if (data.err) {
        console.error("Error getting quiz data!");
      } else {
        // data is loaded so now start the page effects
        setQuizData(data);
        assignJqueryElements();
        setupElements();
        UnselectAllSwitches();
        HideElementsAtQuizStart();
        animateElements();
      }
    },
    complete: (xhr, status) => {
      if (status == "error") {
        $('#full-page').html(xhr.responseText);
      }
    },
  });
};

function assignJqueryElements() {
  // elements for handling theming
  assignThemes();
  $quizContinueButton = $(`#continue-button`);
  $quizBackButton = $(`#back-button`);
  $quizRestartButton = $(`#restart-button`);
  $quizResultContainer = $(`#generated-question-result-container`);
  $streamerRevealContainer = $(`#generated-streamer-reveal-container`);
}

// sets things that we cant just render with ejs
function setQuizData(extraData) {
  setTexts(extraData.requiredTexts);
  QUIZ_QUESTIONS = extraData.Quiz.Questions;
}

// handles the downloading of language texts from our server
function getPageHTML() {
  let language = getLanguage();
  // get all the server-rendered html in our desired language
  $.ajax({
    beforeSend: console.log("getting html for language..."),
    url: "/getHtml",
    type: "POST",
    data: { language },
    success: (data) => {
      if (data.err) {
        console.error("Error getting html!");
      } else {
        $('#full-page').html(data);
        // now we load the rest of the site
        GetRestOfSiteData();
      }
    },
    complete: (xhr, status) => {
      if (status == "error") {
        $('#full-page').html(xhr.responseText);
      }
    },
  });
}

function updateLanguage(language) {
  console.log("updating ", language);
  setLanguage(language);
  $.get('/setLang/' + language, function (json) {
                let nothing = "";
    });
  // first check if the desired language is already loaded (empty if not loaded)
  let loadedLang = getThisLanguageText();
  console.log(loadedLang)
  if (loadedLang == language) {
    console.log("Language already loaded.");
    return;
  }
  restartQuiz();
}

function UnselectAllSwitches() {
  $(`[id^="generated-switch_"]`).prop("checked", "");
}

function HideElementsAtQuizStart() {
  // Hides all the questions to start (except for the 1st)
  for (i = CurrentQuestion + 1; i <= QUIZ_QUESTIONS.length; i++) {
    $(`#generated-quiz-modal-question${i}-container`).hide();
  }

  $quizResultContainer.hide();
  $streamerRevealContainer.hide();
  $quizRestartButton.hide();
  // disable the continue button by default
  $quizContinueButton.prop("disabled", true);
  $quizBackButton.prop("disabled", true);
}

function openGeneratedQuizModal() {
  $("#generated-quiz-modal").modal("show");
}

function toggleTimeInput(question, selection) {
  let selectedSwitch = `#generated-switch_${question}_${selection}`;
  if ($(selectedSwitch).prop("checked") == true) {
    $(`#generated-${question}-${selection}`).show();
  } else {
    $(`#generated-${question}-${selection}`).hide();
  }
}

function exampleOnClickFunction(question, selection) {
  // this does nothing special, its just to show you can override the default onclick function for buttons.
  // since this example is used for the languages question,
  // it's multiple select so we'll just call that function normally anyways
  // since we don't actually need to provide a unique function
  selectMultipleButton(question, selection);
}

function selectButton(question, selection) {
  // unselect previous choices
  $(`[id^="generated-quiz-modal-button_${question}"]`).removeClass("active");
  // select current choice
  $(`#generated-quiz-modal-button_${question}_${selection}`).addClass("active");
  //save the selection
  UsersAnswers[question] = selection;
  $quizContinueButton.prop("disabled", false);
}

function selectMultipleButton(question, selection) {
  if (UsersAnswers[question]) {
    if (UsersAnswers[question].includes(selection)) {
      // remove it from the list
      var index = UsersAnswers[question].indexOf(selection);
      if (index > -1) {
        UsersAnswers[question].splice(index, 1);
        $(`#generated-quiz-modal-button_${question}_${selection}`).removeClass(
          "active"
        );
      }
    } else {
      UsersAnswers[question].push(selection);
      $(`#generated-quiz-modal-button_${question}_${selection}`).addClass(
        "active"
      );
    }
  } else {
    UsersAnswers[question] = [];
    UsersAnswers[question].push(selection);
    $(`#generated-quiz-modal-button_${question}_${selection}`).addClass(
      "active"
    );
  }

  //if no answer, block the continue button
  if (UsersAnswers[question].length == 0) {
    $quizContinueButton.prop("disabled", true);
  } else {
    $quizContinueButton.prop("disabled", false);
  }
  console.log(UsersAnswers);
}

function nextQuestion() {
  console.log(UsersAnswers);
  // adjusts the display progress bar
  adjustProgressBar(CurrentQuestion);

  // see if we are on the last question
  if (CurrentQuestion == QUIZ_QUESTIONS.length) {
    $("#generated-quiz-modal-progress-label").html(getText("results"));
    $(`#generated-quiz-modal-question${CurrentQuestion}-container`).addClass(
      "fade-out"
    );
    $quizContinueButton.hide();
    $quizBackButton.hide();
    setTimeout(() => {
      $quizResultContainer.addClass("fade-in");
      $quizResultContainer.show();
      $(`#generated-quiz-modal-question${CurrentQuestion}-container`).hide();
      calculateQuizResult();
    }, 250);
  } else {
    // go to next question

    setTimeout(() => {
      $(`#generated-quiz-modal-question${CurrentQuestion}-container`).hide();
      // disable the continue button by default for this question
      $quizContinueButton.prop("disabled", true);
      // and unfocus it
      $quizContinueButton.blur();
      // enable or disable the continue button by default for the next question
      $quizContinueButton.prop(
        "disabled",
        QUIZ_QUESTIONS[CurrentQuestion].disableContinueButtonByDefault
      );
      // increment the question
      CurrentQuestion += 1;
      // change the title
      $("#generated-quiz-modal-progress-label").html(
        getText("generated-quiz-modal-progress-label", [
          CurrentQuestion,
          QUIZ_QUESTIONS.length,
        ])
      );
      // slide in the next
      $(`#generated-quiz-modal-question${CurrentQuestion}-container`).addClass(
        "fade-in"
      );
      $(`#generated-quiz-modal-question${CurrentQuestion}-container`).show();
    }, 250);
  }
}

function lastQuestion() {
  // adjusts the display progress bar
  backProgressBar(CurrentQuestion);

  //Enable continue button immediately when going back
  $quizContinueButton.prop("disabled", false);

  // wait 250 ms before sliding back one question
  setTimeout(() => {
    $(`#generated-quiz-modal-question${CurrentQuestion}-container`).hide();
    // decrement the question
    CurrentQuestion -= 1;
    // change the title
    $("#generated-quiz-modal-progress-label").html(
      getText("generated-quiz-modal-progress-label", [
        CurrentQuestion,
        QUIZ_QUESTIONS.length,
      ])
    );
    // slide in the next
    $(`#generated-quiz-modal-question${CurrentQuestion}-container`).addClass(
      "fade-in"
    );
    $(`#generated-quiz-modal-question${CurrentQuestion}-container`).show();
  }, 250);
}

function restartQuiz() {
  RemoveConfetti();
  CurrentQuestion = 1;
  UsersAnswers = {};
  $(`#main-container`).removeClass("wide-container");
  // get rid of unwanted effects
  $(`*`).removeClass(`fade-out`);
  // rerender fresh quiz HTML
  getPageHTML();
}

function checkQuestion(questionNum) {
  //Check Question and enable/disable BACK Button
  if (questionNum == 1) {
    $quizBackButton.prop("disabled", true);
  } else {
    $quizBackButton.prop("disabled", false);
  }
}

function adjustProgressBar(index) {
  let questionNum = index + 1;
  $("#generated-quiz-modal-progress-bar").css(
    "width",
    `${(questionNum / QUIZ_QUESTIONS.length) * 100}%`
  );

  checkQuestion(questionNum);
}

function backProgressBar(index) {
  let questionNum = index - 1;
  $("#generated-quiz-modal-progress-bar").css(
    "width",
    `${(questionNum / QUIZ_QUESTIONS.length) * 100}%`
  );

  checkQuestion(questionNum);
}

function animateElements() {
  $("#sm-circle").hide();
  $("#md-circle").hide();
  $("#lg-circle").hide();
  $(".detective").addClass("slide-in-bottom");
  $(".detective").css("opacity", "100");
  setTimeout(() => {
    $("#sm-circle").addClass("scale-up-center");
    $("#sm-circle").show();
    setTimeout(() => {
      $("#md-circle").addClass("scale-up-center");
      $("#md-circle").show();
      setTimeout(() => {
        $("#lg-circle").addClass("scale-up-center");
        $("#lg-circle").show();
        $("#welcome-text").css("opacity", "100");
      }, 200);
    }, 200);
    setTextAnimation();
  }, 250);
}


//retreives the language's icon to display on the dropdown menu.
function getLanguageIcon(language) {
  // hack to return globe image
  return './images/globe.png';
}

function calculateQuizResult() {
  // Send the results to the server
  $.ajax({
    beforeSend: console.log(`sending answers...`),
    url: "/calculateStreamer",
    type: "POST",
    data: { UsersAnswers },
    success: function (data) {
      console.log(data);
      setTimeout(() => {
        $(`#welcome-banner`).hide();
        $("#generated-quiz-modal").modal("hide");
        if (data.Error != null) {
          console.log(data.Error.message);
          $streamerRevealContainer.show();
        } else {
          console.log(data.Results);
          $(`#main-container`).addClass("wide-container");
          displayStreamerResults(data.Results);
          $streamerRevealContainer.addClass("fade-in");
          $streamerRevealContainer.show();
          $quizRestartButton.show();
          console.log("complete.");
        }
      }, 2500);
    },
    complete: function (xhr, status) {
      if (status == "error") {
        console.log("error");
      }
    },
  });
}

function displayStreamerResults(results) {
  var streamers = results.result;
  ResultStats = results.stats;
  streamers.forEach((streamer, index) => {
    $(`#streamer-${index + 1}-user_name`).text(streamer.user_name);
    $(`#streamer-${index + 1}-logo`).attr("src", streamer.logo);
    $(`#streamer-${index + 1}-match`).text(streamer.match_value);
    $(`#streamer-${index + 1}-twitch_link`).attr(
      "href",
      `https://twitch.tv/${streamer.user_name}`
    );
    $($(".streamer-info-container").get(index)).attr(
      "streamer_id",
      streamer.id
    );
  });
  MakeConfetti();
}

function captureTimeInputs() {
  var offset = new Date().getTimezoneOffset();
  QUIZ_QUESTIONS.forEach((question) => {
    if (question.question_type == 'timerange') {
      let timeObj = {};
      question.answer_settings.forEach((timeRange) => {
        timeObj[timeRange.value_name] =
          $(
            `#generated-switch_${question.unique_question_identifier}_${timeRange.value_name}`
          ).prop("checked") == true;
        timeObj[`${timeRange.value_name}From`] = $(
          `#generated-${question.unique_question_identifier}-${timeRange.value_name}-from`
        ).val();
        timeObj[`${timeRange.value_name}To`] = $(
          `#generated-${question.unique_question_identifier}-${timeRange.value_name}-to`
        ).val();
      });
      timeObj.userOffsetMinute = offset * -1;
      UsersAnswers[question.unique_question_identifier] = timeObj;
    }
  });
}


