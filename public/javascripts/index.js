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
    suffix: "average viewers",
    incrementBy: 50
  },
  "age": {
    min: 16,
    max: 100,
    suffix: "years old",
    incrementBy: 1
  },
}

// CurrentQuestion represents which question we are on
var CurrentQuestion = 1;

// LastQuestion is the last question before we send the results
const LastQuestion = 5;

// Used by the setup functions to display and set callbacks
const SlidersToInitialize = ["average_viewers", "age"]

// holds the references to the sliders so we can call 
// functions on it
var SLIDERS ={};

// a timer for if the increment/decrement buttons are long-held,
// since we want to continue to increment/decrement when button is held
var pressTimer;

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
  SLIDERS[slider] = $(`#slider_${slider}`).slider({ id: `slider_${slider}`, min: minRange, max: maxRange, range: true, value: [minDefault, maxDefault], tooltip: 'hide' });
  UsersAnswers[slider] = {
    min: minDefault,
    max: maxDefault
  };
}

function setupElements() {

  // Hides all the questions to start (except for the 1st)
  for (i = CurrentQuestion + 1; i <= LastQuestion; i++) {
    $(`#question${i}-container`).hide()
  }
  $(`#question-result-container`).hide()
  $(`#streamer-reveal-container`).hide()
  $(`#streamer-name`).hide()
  $(`#watchtime-weekdays`).hide()
  $(`#watchtime-weekends`).hide()
  
  $('.time').clockTimePicker({
    onClose: function() {
      // adjust time
      let watchTime = {
        watchesWeekend: ($(`#switch_watchtime_weekends`).prop("checked") == true),
        watchesWeekdays:  ($(`#switch_watchtime_weekdays`).prop("checked") == true),
        weekendFrom:  $("#watchtime-weekends-from").val(),
        weekendTo: $("#watchtime-weekends-to").val(),
        weekdayFrom:  $("#watchtime-weekdays-from").val(),
        weekdayTo: $("#watchtime-weekdays-to").val()
      } 
      UsersAnswers['watchtime'] = watchTime;
     },
     alwaysSelectHoursFirst: true,
     required: true,
    // custom colors
  colors: {
    buttonTextColor: '#bf7dd3',
    clockFaceColor: '#EEEEEE',
    clockInnerCircleTextColor: '#888888',
    clockInnerCircleUnselectableTextColor: '#CCCCCC',
    clockOuterCircleTextColor: '#000000',
    clockOuterCircleUnselectableTextColor: '#CCCCCC',
    hoverCircleColor: '#DDDDDD',
    popupBackgroundColor: '#FFFFFF',
    popupHeaderBackgroundColor: '#0797FF',
    popupHeaderTextColor: '#FFFFFF',        
    selectorColor: '#DAB9DF',       
    selectorNumberColor: '#FFFFFF',
    signButtonColor: '#FFFFFF',
    signButtonBackgroundColor: '#0797FF'
  },
  });

  // Setup the sliders
  SlidersToInitialize.forEach(slider => {

    setSliderDisplay(slider);
    // add handler functions to the slider's events
    setSliderEventHandlers(slider);
  })

  unselectAllRadios();
  unselectAllSwitches();
  // disable the continue button by default
  $(`#continue-button`).prop('disabled',true);
  $(`#restart-button`).hide();
}

function setSliderEventHandlers(slider){
  // how many milliseconds to hold down the button before it starts incrementing
  const incrementDelay = 100;
  
  // we want to increment the value when holding the mouse button down,
  // and if we click, only increment by 1 unit
  $(`#${slider}-minus`).mouseup(function(){
    // Clear timeout
    clearInterval(pressTimer);
    return false;
  }).mousedown(function(){

    if(UsersAnswers[slider].min > QuestionSettings[slider].min){
      SLIDERS[slider].slider('setValue',[(UsersAnswers[slider].min-QuestionSettings[slider].incrementBy),UsersAnswers[slider].max], true); // must be true to call the 'slide' event
    }
    
    // Set interval
    pressTimer = window.setInterval(function() { 
    
      if(UsersAnswers[slider].min > QuestionSettings[slider].min){
        SLIDERS[slider].slider('setValue',[(UsersAnswers[slider].min-QuestionSettings[slider].incrementBy),UsersAnswers[slider].max], true); // must be true to call the 'slide' event
      }
       
    },incrementDelay);
    return false; 
  });

  $(`#${slider}-plus`).mouseup(function(){
    clearInterval(pressTimer);
    return false;
  }).mousedown(function(){
    if(UsersAnswers[slider].max < QuestionSettings[slider].max){
      SLIDERS[slider].slider('setValue',[UsersAnswers[slider].min,(UsersAnswers[slider].max+QuestionSettings[slider].incrementBy)], true); // must be true to call the 'slide' event
    }
    
    // Set interval
    pressTimer = window.setInterval(function() { 
      if(UsersAnswers[slider].max < QuestionSettings[slider].max){
        SLIDERS[slider].slider('setValue',[UsersAnswers[slider].min,(UsersAnswers[slider].max+QuestionSettings[slider].incrementBy)], true); // must be true to call the 'slide' event
      }
    },100);
    return false; 
  });
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
    $(`#slider_${slider}`).on("slide", (changeEvt) => adjustSliderEventHandler(slider,changeEvt))
  });
}


// quickly making this to house event handler since we 
// need to use it for when we adjust the slider with the buttons
// this will accept events from the DOM, but we will also feed it 
// the updated values from when we increment or decrement with the buttons
// by passing a fake event object: {value:[minVal,maxVal]}
const adjustSliderEventHandler = (slider, changeEvt) => {
  let minRange = changeEvt.value[0];
  let maxRange = changeEvt.value[1];

  let maxRangeDisplay = ((slider == "average_viewers" && maxRange==10000) ? `10000+` :  maxRange);

  let displayText = `Between ${minRange} and ${maxRangeDisplay} ${QuestionSettings[slider].suffix}`;
  $(`#${slider}-slider-display`).text(displayText);
  UsersAnswers[slider] = {
    min: minRange,
    max: maxRange
  }
}

function selectSwitch(question, selection) {
  let selectedSwitch = `#switch_${question}_${selection}`;

  if(question === 'watchtime'){
  
    if ($(selectedSwitch).prop("checked") == true) {
      $(`#watchtime-${selection}`).show();
     
    } else {
      $(`#watchtime-${selection}`).hide();
    
    }


  } else {
    
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

}


function selectRadio(question, selection) {
  // unselect previous choices
  $(`[id^="radio_${question}"]`).prop('checked', "");
  // select current choice
  $(`#radio_${question}-${selection}`).prop('checked', "checked");
  //save the selection
  UsersAnswers[question] = QuestionSettings[question][selection]
}

function selectMultipleButton(question,selection){
  if(UsersAnswers[question]){
    if(UsersAnswers[question].includes(selection)){
     // remove it from the list
    var index = UsersAnswers[question].indexOf(selection);
    if (index > -1) {
      UsersAnswers[question].splice(index, 1);
      $(`#button_${question}_${selection}`).removeClass('active');
    }
    }else{
      UsersAnswers[question].push(selection)
      $(`#button_${question}_${selection}`).addClass('active');
    }
  } else {
    UsersAnswers[question] = [];
    UsersAnswers[question].push(selection) 
    $(`#button_${question}_${selection}`).addClass('active');
  }

  //if no answer, block the continue button
  if(UsersAnswers[question].length==0){
    $(`#continue-button`).prop('disabled',true)
  } else {
    $(`#continue-button`).prop('disabled',false)
  }
  console.log(UsersAnswers)
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
    $(`#question${CurrentQuestion}-container`).addClass("fade-out");
    $("#continue-button").hide();
    // wait 250 ms before sliding in next question
    setTimeout(() => {
      $(`#question${CurrentQuestion}-container`).hide()
      $(`#question-result-container`).addClass("fade-in")
      $(`#question-result-container`).show()
      

      calculateQuizResult();

    }, 250);

  } else {
    // go to next question
    // slide out current question
    $(`#question${CurrentQuestion}-container`).addClass("fade-out")

    // wait 250 ms before sliding in next question
    setTimeout(() => {
      $(`#question${CurrentQuestion}-container`).hide()

      // disable the continue button by default for this question
      $(`#continue-button`).prop('disabled',true)
      // and unfocus it
      $(`#continue-button`).blur()

      // increment the question
      CurrentQuestion += 1;

      // enable the continue button by default for specific questions
      if(CurrentQuestion==3 || CurrentQuestion==4 || CurrentQuestion==5){
        $(`#continue-button`).prop('disabled',false)
      } 
      // change the title
      $('#quiz-modal-label').text(`Question ${CurrentQuestion} of ${LastQuestion}`);
      // slide in the next
      $(`#question${CurrentQuestion}-container`).addClass("fade-in")
      $(`#question${CurrentQuestion}-container`).show()
    }, 250);
  }
}

function restartQuiz() {
  // reset the global variables
  CurrentQuestion = 1;
  UsersAnswers = {};

  // get rid of unwanted effects
  $(`*`).removeClass(`fade-out`);
  $(`button.active`).removeClass(`active`);

  //initialization again
  setupElements();
  setupCallbacks();

  // change the title
  $('#quiz-modal-label').text(`Question 1 of ${LastQuestion}`);

  // show the first quiz container
  $(`#question1-container`).addClass("fade-in")
  $(`#question1-container`).show();

  // show the continue button
  $(`#continue-button`).show();

  // adjust progress bar to first question
  adjustProgressBar(0);
}

function adjustProgressBar(index) {
  let questionNum = index + 1;
  $("#quiz-modal-progress-bar").css("width", `${((questionNum) / LastQuestion * 100)}%`);
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
      $(`#question-result-container`).addClass("fade-out")
      setTimeout(() => {
        $(`#question-result-container`).hide()
        if(data.Error != null ){
          console.log(data.Error.message)
          $(`#streamer-reveal-container`).show()
          $('#streamer-name').text(data.Error.message)
          $('#streamer-name').show()
        } else {
          console.log(data.Results);
          displayStreamerResults(data.Results);
          $(`#streamer-reveal-container`).addClass("fade-in");
          $(`#streamer-reveal-container`).show();
          $("#restart-button").show();
          console.log("complete.")
        }
      }, 350);

    },
    complete: function (xhr, status) {
      if (status == 'error') {
        console.log('error')
      }
    }
  });
}

function displayStreamerResults(streamers){
  streamers.forEach((streamer,index)=>{
    $(`#streamer-${index+1}-user_name`).text(streamer.user_name);
    $(`#streamer-${index+1}-logo`).attr('src',streamer.logo);
    $(`#streamer-${index+1}-match`).text(streamer.match_value);
    $(`#streamer-${index+1}-twitch_link`).attr("href", `https://twitch.tv/${streamer.user_name}`);
    
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