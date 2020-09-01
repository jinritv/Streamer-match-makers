$(() => {
  // once page is loaded
  $("#streamer-quiz-form").steps({
    headerTag: "h3",
    bodyTag: "fieldset",
    transitionEffect: "fade",
    transitionEffectSpeed: 500,
    onStepChanging: onChangeQuestion,
    onStepChanged: onQuestionChanged
  });



  var minSlider = document.getElementById("minSlider");
  var minOutput = document.getElementById("minViewer");
  minOutput.innerHTML = minSlider.value;

  minSlider.oninput = function () {
    minOutput.innerHTML = this.value;
  }

  var maxSlider = document.getElementById("maxSlider");
  var maxOutput = document.getElementById("maxViewer");
  maxOutput.innerHTML = maxSlider.value;

  maxSlider.oninput = function () {
    maxOutput.innerHTML = this.value;
  }

  //starts oage animations
  animateElements();

  /*
  $("#viewerSlider").slider({
      min: 0,
      max: 10000,
      value: [0, 10],
      focus: true
  
  });
  */
});

function onChangeQuestion(event, currentIndex, newIndex) {
  saveResult(currentIndex);
  adjustProgress(newIndex);
  return true;
}

function onQuestionChanged(event, currentIndex, newIndex) {
  return true;
}

var UsersAnswers = [];

function saveResult(index) {

  let saveObject = {};

  switch (index) {
    case 0:
      saveObject.rangeMin = $('#question-1 .range-min input').val();
      saveObject.rangeMax = $('#question-1 .range-max input').val();
      break;
    case 1:
      if ($("#followerCountRadios1").is(":checked")) {
        saveObject.followerCount = "1000"
      } else if ($("#followerCountRadios2").is(":checked")) {
        saveObject.followerCount = "10000"
      } else if ($("#followerCountRadios3").is(":checked")) {
        saveObject.followerCount = "100000"
      }
      // code block
      break;
    // down here
    case 2:
      if($("#ageRadios1").is(":checked")) {
        saveObject.ageRatios = "18-20"
      } else if ($("#ageRadios2").is(":checked")) {
        saveObject.ageRatios = "20-29"
      } else if ($("#ageRadios3").is(":checked")) {
        saveObject.ageRatios = "30+"
      }
      break;
    case 3:
      if($("#langRadios1").is(":checked")) {
        saveObject.language = "English"
      } else if ($("#langRadios2").is(":checked")) {
        saveObject.language = "Korean"
      } else if ($("#langRadios3").is(":checked")) {
        saveObject.language = "Japanese"
      } else if ($("#langRadios4").is(":checked")) {
        saveObject.language = "Chinese"
      } else if ($("#langRadios5").is(":checked")) {
        saveObject.language = "Thai"
      }
     
      break;
    case 4:
      if($("#contentRadios1").is(":checked")) {
        saveObject.content = "Just Chatting"
      } else if ($("#contentRadios2").is(":checked")) {
        saveObject.content = "Games"
      } else if ($("#contentRadios3").is(":checked")) {
        saveObject.content = "ASMR"
      } else if ($("#contentRadios4").is(":checked")) {
        saveObject.content = "Science & Technology"
      } else if ($("#contentRadios5").is(":checked")) {
        saveObject.content = "Cooking"
      } else if ($("#contentRadios6").is(":checked")) {
        saveObject.content = "Food"
      } else if ($("#contentRadios7").is(":checked")) {
        saveObject.content = "Outdoors"
      } else if ($("#contentRadios8").is(":checked")) {
        saveObject.content = "IRL"
      } else if ($("#contentRadios9").is(":checked")) {
        saveObject.content = "Movies with Viewers (Discord)"
      } else if ($("#contentRadios10").is(":checked")) {
        saveObject.content = "Music"
      } else if ($("#contentRadios11").is(":checked")) {
        saveObject.content = "Yoga"
      } else if ($("#contentRadios12").is(":checked")) {
        saveObject.content = "Dancing"
      }
      break;
    case 5:
      // voice tone?
      if($("#voiceRadios1").is(":checked")) {
        saveObject.content = "1"
      } else if ($("#voiceRadios2").is(":checked")) {
        saveObject.content = "2"
      } else if ($("#voiceRadios2").is(":checked")) {
        saveObject.content = "3"
      } else if ($("#voiceRadios2").is(":checked")) {
        saveObject.content = "4"
      } else if ($("#voiceRadios2").is(":checked")) {
        saveObject.content = "5"
      } 
      break;
    case 6:
      // has a cam?
      camRadios1
      if($("#camRadios1").is(":checked")) {
        saveObject.cam = true;
      } else if ($("#camRadios2").is(":checked")) {
        saveObject.cam = false;
      }
      break;
    case 7:
      // what is going on here

// @jinritv
// what is this.. we already have camRAdios


      if($("#camRadios1").is(":checked")) {
        saveObject.cam = true;
      }
      break;
    case 8:
      //follow only?
      if($("#followRadios1").is(":checked")) {
        saveObject.follow = true;
      } else if ($("#followRadios2").is(":checked")) {
        saveObject.follow = false;
      }
      break;

    default:
    // code block
  }

  UsersAnswers[index] = saveObject;
  console.log(UsersAnswers)
}

function adjustProgress(index) {
  let questionNum = index + 1;
  $("#quiz-progress-bar").css("width", `${((questionNum) / 10 * 100)}%`);
  if (questionNum == 10) {
    $('#quiz-progress-bar span').text(`Complete!`);
  } else {
    $('#quiz-progress-bar span').text(`${questionNum} of 9`);
  }
}

function animateElements() {
  $("#bg-rectangle").addClass("bounce-in-top");
  $("#bg-rectangle").show();
  $("#dancing-jinri").addClass("slide-in-right");
  $("#dancing-jinri").show();
  $("#logo-container").addClass("slide-in-blurred-left")
  $("#start-quiz-button").addClass("fade-in");
  $("#welcome-text").addClass("swing-in-left-fwd")
}

function prepareQuiz() {
  console.log("preparing quiz...")
  $("#welcome-text").removeClass("swing-in-left-fwd")
  $("#welcome-text").addClass("slide-out-left")
  $("#dancing-jinri").addClass("slide-out-right")
  $("#start-quiz-button").addClass("fade-out");
  setTimeout(() => {
    $("#welcome-banner").hide();
    $("#quiz").addClass("bounce-in-bottom")
    $("#quiz").show();
  }, 1000)
}

function calculateQuizResult() {
  // Fake quiz results to force a streamer response 
  var quizResults = [
    true,
    false,
    4,
    5,
    "high",
    true,
    15
  ];

  // Send the results to the server
  $.ajax({
    beforeSend: displayResultMessage(`Sending Quiz Results ${JSON.stringify(quizResults)} to server...`),
    url: "/calculateStreamer",
    type: "POST",
    data: { quizResults },
    success: function (data) {
      console.log(data)
      setSuccess(data.Error == null);
      if (data.Error != null) {
        displayOutput(`<br/>${data.Error}`);
      } else {
        displayOutput(`<br/>Result: ${JSON.stringify(data.Results)}`);
      }
    },
    complete: function (xhr, status) {
      if (status == 'error') {
        console.log('error')
      }
    }
  });
}


function displayOutput(text) {
  $('#quiz-results-display').append(text);
}

function setSuccess(success) {
  if (success) {
    $("#get-result-button").addClass("btn-success");
    $("#get-result-button").removeClass("btn-danger");
  } else {
    $("#get-result-button").addClass("btn-danger");
    $("#get-result-button").removeClass("btn-success");
  }
}

function displayResultMessage(message) {
  $("#quiz-results-display").text(message);
}
