// UsersAnswers is a dynamic object that stores the answers to the quiz questions. 
// Update it as soon as possible (like in the onchange event)
// and the end of the quiz, this is what is sent to our API to calculate the streamer. 
var UsersAnswers = {};

// QuestionSettings stores any initialization values, such as mix/max values
// for the question (if applicable)
const QuestionSettings = {
  "average_viewers": {
    min: 0,
    max: 10000,
    suffix: "average viewers"
  },
  "follower_count": {
    1: "Less than 10000",
    2: "between 10000 and 100000",
    3: "100000 to 1000000"
  },
  "age": {
    min: 16,
    max: 100,
    suffix: "years old"
  },
  "voice": {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5
  }
}

// CurrentQuestion represents which question we are on
var CurrentQuestion = 1;

// LastQuestion is the last question before we send the results
const LastQuestion = 9;

// Used by the setup functions to display and set callbacks
const SlidersToInitialize = ["average_viewers", "age"]

// This is called when the page is loaded
$(() => {
  // setup our bootstrap elements like the sliders
  setupElements();

  // setup the callbacks for the different events
  setupCallbacks();

  //starts page animations
  animateElements();
});

function setSliderDisplay(slider) {
  let minRange = QuestionSettings[slider].min;
  let maxRange = QuestionSettings[slider].max;

  let minDefault = Math.floor(maxRange / 4);
  let maxDefault = Math.floor(maxRange / 4) * 3;

  let displayText = `Between ${minDefault} and ${maxDefault} ${QuestionSettings[slider].suffix}`;
  $(`#${slider}-slider-display`).text(displayText);
  $(`#slider_${slider}`).slider({ id: `slider_${slider}`, min: minRange, max: maxRange, range: true, value: [minDefault, maxDefault], tooltip: 'hide' });
}

function setupElements() {
  // Hides all the questions to start (except for the 1st)
  for (i = CurrentQuestion + 1; i <= LastQuestion; i++) {
    $(`#question${i}-container`).hide()
  }
  $(`#question-result-container`).hide()
  $(`#streamer-reveal-container`).hide()
  $(`#streamer-name`).hide()

  // Setup the sliders
  SlidersToInitialize.forEach(slider => {
    setSliderDisplay(slider);
  })

  unselectAllRadios();
  unselectAllSwitches();
}

function unselectAllSwitches() {
  $(`[id^="switch_"]`).prop('checked', "");
}

function unselectAllRadios() {
  $(`[id^="radio_`).prop('checked', "");
}

function revealStreamer() {
  $("#streamer-name").addClass("focus-in-expand");

  $(`#streamer-name`).show()

}

function setupCallbacks() {
  // When the "Find the Streamer" button is pressed,
  // open the modal and display the quiz
  $('#quiz-modal').on('shown.bs.modal', function (e) {
    // start animation for quiz display
    $("#quiz-content-modal").css("opacity", 100);
  });

  // When the range is adjusted, display the changes in text, 
  // and save the value to the UserAnswers array. 
  // Setup the sliders, assuming 1 slider with 2 values per question
  SlidersToInitialize.forEach(slider => {
    $(`#slider_${slider}`).on("slide", (slideEvt) => {
      let minRange = slideEvt.value[0];
      let maxRange = ((slideEvt.value[1] == 10000 && slider == "average_viewers") ? "10000+" : slideEvt.value[1]);

      let displayText = `Between ${minRange} and ${maxRange} ${QuestionSettings[slider].suffix}`;
      $(`#${slider}-slider-display`).text(displayText);
      UsersAnswers[slider] = {
        min: minRange,
        max: maxRange
      }
    });
  })
}

function selectSwitch(question, selection) {

  let selectedSwitch = `#switch_${question}_${selection}`;
  let selectedSwitches = UsersAnswers[question] == undefined ? [] : UsersAnswers[question]

  if ($(selectedSwitch).prop("checked") == true) {
    // add the selection to the list
    selectedSwitches.push(selection);
  } else {
    // remove it from the list
    var index = selectedSwitches.indexOf(selection);
    if (index > -1) {
      selectedSwitches.splice(index, 1);
    }
  }

  UsersAnswers[question] = selectedSwitches
  console.log(UsersAnswers)
}

function selectRadio(question, selection) {
  // unselect previous choices
  $(`[id^="radio_${question}"]`).prop('checked', "");
  // select current choice
  $(`#radio_${question}-${selection}`).prop('checked', "checked");
  //save the selection
  UsersAnswers[question] = QuestionSettings[question][selection]
}

function selectButton(question, selection) {
  // unselect previous choices
  $(`[id^="button_${question}"]`).removeClass('active');
  // select current choice
  $(`#button_${question}_${selection}`).addClass('active');
  //save the selection
  UsersAnswers[question] = selection;
}

function nextQuestion() {
  console.log(UsersAnswers)
  // adjusts the display progress bar
  adjustProgressBar(CurrentQuestion);

  // see if we are on the last question
  if (CurrentQuestion == LastQuestion) {
    $('#quiz-modal-label').text(`Results`);
    $(`#question${CurrentQuestion}-container`).addClass("slide-out-left")
    $("#continue-button").hide()
    // wait 250 ms before sliding in next question
    setTimeout(() => {
      $(`#question${CurrentQuestion}-container`).hide()
      $(`#question-result-container`).addClass("slide-in-right")
      $(`#question-result-container`).show()

      calculateQuizResult();

    }, 250);

  } else {
    // go to next question
    // slide out current question
    $(`#question${CurrentQuestion}-container`).addClass("slide-out-left")

    // wait 250 ms before sliding in next question
    setTimeout(() => {
      $(`#question${CurrentQuestion}-container`).hide()
      // increment the question
      CurrentQuestion += 1;
      // change the title
      $('#quiz-modal-label').text(`Question ${CurrentQuestion} of ${LastQuestion}`);
      // slide in the next
      $(`#question${CurrentQuestion}-container`).addClass("slide-in-right")
      $(`#question${CurrentQuestion}-container`).show()
    }, 250);
  }
}

function adjustProgressBar(index) {
  let questionNum = index + 1;
  $("#quiz-modal-progress-bar").css("width", `${((questionNum) / 10 * 100)}%`);
  if (questionNum == 10) {
    // quiz is complete
    $('#quiz-modal-progress-bar span').text(`Complete!`);
  }
}

function loadImage(){
  let url = $("#add-streamer_logo_url").val();
  $("#streamer-picture").attr('src',url)
}

function openQuizModal() {
  $("#quiz-modal").modal('show');
}

function closeQuizModal() {
  $("#quiz-modal").modal('hide');
}

function animateElements() {
  $("#bg-rectangle").addClass("bounce-in-top");
  $("#bg-rectangle").show();
  $("#dancing-jinri").addClass("slide-in-right");
  $("#dancing-jinri").show();
  $("#logo-container").addClass("slide-in-blurred-left")
  $("#start-quiz-button").addClass("fade-in");
  $("#start-quiz-button-modal").addClass("fade-in");
  $("#welcome-text").addClass("swing-in-left-fwd")
}

function calculateQuizResult() {
  // Send the results to the server
  $.ajax({
    beforeSend: displayResultMessage(`Sending Quiz Results ${JSON.stringify(UsersAnswers)} to server...`),
    url: "/calculateStreamer",
    type: "POST",
    data: { UsersAnswers },
    success: function (data) {
      console.log(data)
      $(`#question-result-container`).addClass("slide-out-left")

      setTimeout(() => {
        $(`#question-result-container`).hide()
        if(data.Error != null ){
          console.log(data.Error.message)
          $(`#streamer-reveal-container`).show()
          $('#streamer-name').text(data.Error.message)
          $('#streamer-name').show()
        } else {
          $('#streamer-name').text(data.Results.user_name)
          $(`#streamer-reveal-container`).addClass("slide-in-right")
          $(`#streamer-reveal-container`).show()
  
          console.log("complete.")
        }
      
      }, 250);

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

function openAddStreamerModal() {
  $("#add-streamer-modal").modal('show');
}

function closeAddStreamerModal() {
  $("#add-streamer-modal").modal('hide');
}

function toggleButton(buttonName){
  if($(`#button_${buttonName}`).hasClass("active")){
      // select current choice
  $(`#button_${buttonName}`).removeClass('active');
  } else {
  // select current choice
  $(`#button_${buttonName}`).addClass('active');
  }

}



function addStreamer(){

  let textInputs = {
    followers: "",
    voice: "",
    avg_viewers: "",
    avg_stream_duration: "",
    logo_url: "",
    user_name: "",
    display_name: "",
    streamer_name: "",
  }

  let multipleInputs = {
    nationality: [],
    languages: [],
  }

  
  let otherInputs = {
    is_partner: false,
    is_fulltime: false,
    uses_cam: false,
    mature_stream: false,
   
  }

  let newStreamer = {
    ...(()=>{
      let vals = {}
      Object.keys(textInputs).forEach(input=>{
        vals[`${input}`] = $(`#add-streamer_${input}`).val()
      })
      return vals
    })(),
    ...(()=>{
      let vals = {}
      Object.keys(otherInputs).forEach(input=>{
        vals[`${input}`] = ($(`#button_${input}`).hasClass("active"))
      })
      return vals
    })(),
    native_language: $("#add_native_language option:selected").val(),
    location: $("#add_streamer_location option:selected").val(),  
    password: $("#add_streamer_password").val(),
    languages: getLanguages(),
    nationality: getNationalities()
  }



  console.log("New streamer:")
  console.log(newStreamer)
  createNewStreamer(newStreamer)

}
const language_switches = [
  "english",
  "korean",
  "japanese",
  "chinese"
]
function getLanguages(){
  let streamerLanguages = [];
  language_switches.forEach(language=>{
    if($(`#switch_add_languages_${language}`).prop("checked") == true){
      streamerLanguages.push({
        id: $(`#switch_add_languages_${language}`).val(),
        native: ($("#add_native_language option:selected").val()==$(`#switch_add_languages_${language}`).val()),
      })
    }
  })
  return streamerLanguages
}


const nationality_switches = [
  "american",
  "korean",
  "chinese",
  "japanese",
  "canadian"
]
function getNationalities(){
  let streamerNationalities = [];
  nationality_switches.forEach(nationality=>{
    if($(`#switch_add_nationality_${nationality}`).prop("checked") == true){
      streamerNationalities.push({
        id: $(`#switch_add_nationality_${nationality}`).val(),
      })
    }
  })
  return streamerNationalities
}
function createNewStreamer(newStreamer) {
  // Send the results to the server
  $.ajax({
    beforeSend: console.log("sending new streamer..."),
    url: "/createNewStreamer",
    type: "POST",
    data: { newStreamer },
    success: function (data) {
      console.log(data)

    },
    complete: function (xhr, status) {
      if (status == 'error') {
        console.log('error')
      }
    }
  });
}