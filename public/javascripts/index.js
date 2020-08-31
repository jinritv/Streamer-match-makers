$(()=>{
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

function onChangeQuestion (event, currentIndex, newIndex) { 
  saveResult(currentIndex); 
  adjustProgress(newIndex);         
  return true; 
}

function onQuestionChanged (event, currentIndex, newIndex) { 
  return true; 
}

var UsersAnswers = [];

function saveResult(index){

  let saveObject = {};

  switch(index) {
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
    default:
      // code block
  } 

  UsersAnswers[index] = saveObject;
  console.log(UsersAnswers)
}

function adjustProgress(index){
  let questionNum = index+1;
  $("#quiz-progress-bar").css("width",`${((questionNum)/10*100)}%`);
  if(questionNum==10){
    $('#quiz-progress-bar span').text(`Complete!`);
  } else {
    $('#quiz-progress-bar span').text(`${questionNum} of 9`);
  }
}

function animateElements(){
  $("#bg-rectangle").addClass("bounce-in-top");
  $("#bg-rectangle").show();
  $("#dancing-jinri").addClass("slide-in-right");
  $("#dancing-jinri").show();
  $("#logo-container").addClass("slide-in-blurred-left")
  $("#start-quiz-button").addClass("fade-in");
  $("#welcome-text").addClass("swing-in-left-fwd")
}

function prepareQuiz(){
  console.log("preparing quiz...")
  $("#welcome-text").removeClass("swing-in-left-fwd")
  $("#welcome-text").addClass("slide-out-left")
  $("#dancing-jinri").addClass("slide-out-right")
  $("#start-quiz-button").addClass("fade-out");
  setTimeout(()=>{
    $("#welcome-banner").hide();
    $("#quiz").addClass("bounce-in-bottom")
    $("#quiz").show();
  }, 1000)
}

function calculateQuizResult(){
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
      url:"/calculateStreamer",
      type: "POST",
      data: {quizResults},
      success: function (data) { 
          console.log(data)
          setSuccess(data.Error==null);
          if(data.Error != null){
              displayOutput(`<br/>${data.Error}`);
          } else {
              displayOutput(`<br/>Result: ${JSON.stringify(data.Results)}`);
          }
      },
      complete: function(xhr, status) {
        if (status == 'error') {
          console.log('error')
        }
      }
    });
}


function displayOutput(text){
  $('#quiz-results-display').append(text);
}

function setSuccess(success){
  if(success){
      $("#get-result-button").addClass("btn-success");
      $("#get-result-button").removeClass("btn-danger");
  } else {
      $("#get-result-button").addClass("btn-danger");
      $("#get-result-button").removeClass("btn-success");
  }
}

function displayResultMessage(message){
  $("#quiz-results-display").text(message);
}
