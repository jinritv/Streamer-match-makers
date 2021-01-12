// UsersAnswers is a dynamic object that stores the answers to the quiz questions. 
// Update it as soon as possible (like in the onchange event)
// and the end of the quiz, this is what is sent to our API to calculate the streamer. 
var UsersAnswers = {};

// CurrentQuestion represents which question we are on
var CurrentQuestion = 1;

// holds the references to the sliders so we can call 
// functions on it
var SLIDERS = {};

// a timer for if the increment/decrement buttons are long-held,
// since we want to continue to increment/decrement when button is held
var pressTimer;

// statistic of scoring result
var ResultStats = {};

// The theme, either 'light' or 'dark'
const THEMES = {
  Dark: 'dark-mode',
  Light: 'light-mode'
}
var CurrentTheme = THEMES.Light;

// what language is currently being displayed on the screen
let _CURRENT_LANGUAGE_;

// Every text we display to the user comes from this object, which we
// store as .json files on the server, which is loaded when we open
// the site page (default to browser language), and when we change the language from
// the dropdown.
var TEXTS = {};

// Urls of the language icons we get with our call to load languages
var ICONS = {};

// The languages choices we have translations for (to display in the drop-down)
var AVAILABLE_LANGUAGES = [];

// jquery elements
var $Labels = {};

// change the class of the wrapper to change the theme colors
var $ThemeWrapper, $themeLabel;

var $languageLabel, $languageIcon;

var $quizContinueButton, $quizBackButton, $quizRestartButton;

var $quizResultContainer, $streamerRevealContainer;

// We want to load the language text first, then load the rest
// of the site. So put any functions in here that will be called
// after we receive our language translation JSON.
const CallbackLoadRestOfSite = () => {
  // generate all the HTML we need for the quiz
  BuildQuiz(); // This is defined in 'create_quiz.js'
  // setup our bootstrap elements like the sliders
  assignJqueryElements();
  setupElements();
  // setup the callbacks for the different events
  setupCallbacks();
  // change language for the elements that come in the static html
  addTextToStaticElements();
  // creates the dropdown menu for language selection
  SetupLanguageDropdown();
  //starts page animations
  animateElements();
}

function assignLabels() {
  // only changes when the language changes
  const LABEL_IDS = [
    "page-title",
    "logoText",
    "copyright-text",
    "animated-words-label",
    "find-streamer-button",
  ];
  LABEL_IDS.forEach(labelID => {
    $Labels[labelID] = $(`#${labelID}`);
  });
}

function assignThemes() {
  $ThemeWrapper = $('#page-top');
  $themeIcon = $('#theme-icon');
  $themeLabel = $('#theme-label');
}

function assignJqueryElements() {
  // static labels (do not change once loaded)
  assignLabels();
  // elements for handling theming
  assignThemes();
  $languageLabel = $(`#current-language-label`);
  $languageIcon = $(`#current-language-icon`);
  $quizContinueButton = $(`#continue-button`);
  $quizBackButton = $(`#back-button`);
  $quizRestartButton = $(`#restart-button`);
  $quizResultContainer = $(`#generated-question-result-container`);
  $streamerRevealContainer = $(`#generated-streamer-reveal-container`);
}

// This is called when the page is loaded
$(() => {
  // Set default language
  _CURRENT_LANGUAGE_ = getDefaultLanguage();
  // downloads the site's texts and then the callback to load the rest of the site
  SetupLanguage(getDefaultLanguage(), CallbackLoadRestOfSite);
});

// This is called after we change our language and receive the new JSON data
const CallbackOnLanguageChanged = () => {
  addTextToStaticElements();
  SetupLanguageDropdown();
  restartQuiz();
  setTextAnimation();
}

// gets the default language, which we retreive from the browser
function getDefaultLanguage() {
  let lang = navigator.language;
  console.log({ BrowserLanguage: lang, SupportedLanguages: navigator.languages });
  return lang;
}


// handles the downloading of language texts from our server
function SetupLanguage(language, CallbackOnLanguageLoaded) {
  // first check if the desired language is already loaded (empty if not loaded)
  if (TEXTS['this-language']) {
    console.log({
      CurrentLanguage: TEXTS['this-language'],
      RequestedLanguage: language
    });
    if (TEXTS['this-language'] == language) {
      console.log("Language already loaded.");
      return
    }
  }
  // if its not loaded, or we need to change the language, make the request
  $.ajax({
    beforeSend: console.log('getting localized texts...'),
    url: "/getLocalization",
    type: "POST",
    data: { language },
    success: (data) => {
      if (data.err) {
        console.error("Error getting language texts");
      } else {
        // This error comes when trying to load the json file with fs.readFile()
        // If there is an error, we will receive the en-US language texts.
        if (data.Results.Error) {
          console.error(data.Results.Error)
        }
        AVAILABLE_LANGUAGES = data.Results.AvailableLanguages;
        TEXTS = data.Results.Texts;
        ICONS = data.Results.Icons;

        // now we load the rest of the site
        CallbackOnLanguageLoaded();
      }
    },
    complete: (xhr, status) => {
      if (status == 'error') {
        console.log('error')
      }
    }
  })
}


// returns an error message and outputs and error to the console.
function sadKEK(label, message) {
  console.error(`${getLanguage()} language error for '${label}': ${message}`)
  return `<span style="color:red">${message} <img src="https://cdn.betterttv.net/emote/5d72ae0aa32edb714a9df060/1x"/></span>`;
}

function addTextToStaticElements() {
  for (const [elementID, elementRef] of Object.entries($Labels)) {
    elementRef.html(getText(elementID));
  }
  let nextTheme = CurrentTheme == THEMES.Dark ? THEMES.Light : THEMES.Dark;
  $themeIcon.text(CurrentTheme == THEMES.Dark ? '🌞' : '🌚')
  $themeLabel.text(getText(`${nextTheme}-label`));
}

// Toggles the theme to dark/light mode
function toggleDarkMode() {
  // remove current theme
  $ThemeWrapper.removeClass(CurrentTheme);
  // get opposite of current theme for the next theme
  let nextTheme = CurrentTheme == THEMES.Dark ? THEMES.Light : THEMES.Dark;
  $ThemeWrapper.addClass(nextTheme);
  $themeIcon.text(nextTheme == THEMES.Dark ? '🌞' : '🌚')
  $themeLabel.text(getText(`${CurrentTheme}-label`));
  CurrentTheme = nextTheme;
}

function generateDropdownOptions() {
  let dropdownHtml = ``;
  let languages = Object.values(AVAILABLE_LANGUAGES);
  languages.forEach(language => {
    let icon = getLanguageIcon(language);
    let name = getText(`drop-down-label-${language}`);
    dropdownHtml += HTMLStrings.LanguageDropDownItem(language, icon, name)
  })
  return dropdownHtml;
}

function updateLanguage(language) {
  console.log('updating ', language)
  // unselect previous language choice
  $(`[id^="generated-dropdown-option-"]`).removeClass('active');
  // set current active language
  $(`#generated-dropdown-option-${language}`).addClass('active');
  $languageLabel.html(getText(`drop-down-label-${language}`))
  $languageIcon.attr('src', getLanguageIcon(language));
  setLanguage(language);
  SetupLanguage(language, CallbackOnLanguageChanged);
}

function SetupLanguageDropdown() {
  let dropdownHtml = HTMLStrings.LanguageDropDown(getLanguageIcon(getLanguage()), getText(`drop-down-label-${getLanguage()}`), generateDropdownOptions())
  $(`#generated-language-dropdown`).html(dropdownHtml)
}

function setupElements() {
  InitializeSliders();
  InitializeTimePickers();
  InitializeStarryRatings();
  UnselectAllSwitches();
  HideElementsAtQuizStart();
  // statistic tooltip hovefr
  setupStatsTooltipHover();
}

function InitializeSliders() {
  QUIZ_QUESTIONS.forEach(question => {
    if (question.question_type == QuestionTypes.RangeSlider) {
      setSliderDisplay(question.unique_question_identifier, question.answer_settings);
      setSliderEventHandlers(question.unique_question_identifier, question.answer_settings);
    }
  })
}

function InitializeTimePickers() {
  $('.time').clockTimePicker({
    onClose: function () {
      captureTimeInputs();
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
}

function InitializeStarryRatings() {
  UsersAnswers['ranks'] = {};

  for (var i = 0; i < QUIZ_QUESTIONS.length; ++i) {
    let question = QUIZ_QUESTIONS[i];

    // default rank
    UsersAnswers['ranks'][question.unique_question_identifier] = 3;

    let starRatingId = `question${i + 1}-weight-star-rating`
    let starRatingEl = document.getElementById(starRatingId);

    if (starRatingEl) {
      new Starry(starRatingEl, {
        name: starRatingId,
        beginWith: 60, // 3 out of 5 stars
        multiple: true,
        onRate: function (rating) {
          UsersAnswers['ranks'][question.unique_question_identifier] = parseInt(rating) || 3;
        }
      });
    }
  }
}

function UnselectAllSwitches() {
  $(`[id^="generated-switch_"]`).prop('checked', "");
}

function HideElementsAtQuizStart() {
  // Hides all the questions to start (except for the 1st)
  for (i = CurrentQuestion + 1; i <= QUIZ_QUESTIONS.length; i++) {
    $(`#generated-quiz-modal-question${i}-container`).hide()
  }

  $quizResultContainer.hide();
  $streamerRevealContainer.hide()
  QUIZ_QUESTIONS.forEach(question => {
    if (question.question_type == QuestionTypes.TimeRange) {
      question.answer_settings.forEach(timeInput => {
        $(`#generated-${question.unique_question_identifier}-${timeInput.value_name}`).hide()
      })
    }
  })

  $quizRestartButton.hide();
  // disable the continue button by default
  $quizContinueButton.prop('disabled', true);
  $quizBackButton.prop('disabled', true);
}

function setSliderDisplay(sliderName, settings) {
  let minRange = settings.min;
  let maxRange = settings.max;
  let minDefault = settings.defaultMin;
  let maxDefault = settings.defaultMax;
  let displayText = getText(`range-display-${sliderName}`, [minDefault, maxDefault]);
  $(`#generated-${sliderName}-slider-display`).html(displayText);
  $(`#generated-${sliderName}-slider-display`).addClass('slider-display-text');
  SLIDERS[sliderName] = $(`#generated-slider_${sliderName}`).slider({ id: `generated-slider_${sliderName}`, min: minRange, max: maxRange, range: true, value: [minDefault, maxDefault], tooltip: 'hide' });
  UsersAnswers[sliderName] = {
    min: minDefault,
    max: maxDefault
  };
}

function openGeneratedQuizModal() {
  // prod database not changed yet
  // return;
  $("#generated-quiz-modal").modal('show');
}

function setSliderEventHandlers(sliderName, settings) {
  // how many milliseconds to hold down the button before it starts incrementing
  const incrementDelay = 100;

  // we want to increment the value when holding the mouse button down,
  // and if we click, only increment by 1 unit
  $(`#generated-${sliderName}-minus`).mouseup(function () {
    // Clear timeout
    clearInterval(pressTimer);
    return false;
  }).mousedown(function () {
    if (UsersAnswers[sliderName].min > settings.min) {
      SLIDERS[sliderName].slider('setValue', [(UsersAnswers[sliderName].min - settings.incrementBy), UsersAnswers[sliderName].max], true); // must be true to call the 'slide' event
    }
    // Set interval
    pressTimer = window.setInterval(function () {
      if (UsersAnswers[sliderName].min > settings.min) {
        SLIDERS[sliderName].slider('setValue', [(UsersAnswers[sliderName].min - settings.incrementBy), UsersAnswers[sliderName].max], true); // must be true to call the 'slide' event
      }
    }, incrementDelay);
    return false;
  });
  $(`#generated-${sliderName}-plus`).mouseup(function () {
    clearInterval(pressTimer);
    return false;
  }).mousedown(function () {
    if (UsersAnswers[sliderName].max < settings.max) {
      SLIDERS[sliderName].slider('setValue', [UsersAnswers[sliderName].min, (UsersAnswers[sliderName].max + settings.incrementBy)], true); // must be true to call the 'slide' event
    }
    // Set interval
    pressTimer = window.setInterval(function () {
      if (UsersAnswers[sliderName].max < settings.max) {
        SLIDERS[sliderName].slider('setValue', [UsersAnswers[sliderName].min, (UsersAnswers[sliderName].max + settings.incrementBy)], true); // must be true to call the 'slide' event
      }
    }, 100);
    return false;
  });
}

function setupCallbacks() {
  // When the range is adjusted, display the changes in text, 
  // and save the value to the UserAnswers array. 
  // Setup the sliders, assuming 1 slider with 2 values per question
  QUIZ_QUESTIONS.forEach(question => {
    if (question.question_type == QuestionTypes.RangeSlider) {
      $(`#generated-slider_${question.unique_question_identifier}`).on("slide", (changeEvt) => adjustSliderEventHandler(question.unique_question_identifier, question.answer_settings, changeEvt))
    }
  })
}

const adjustSliderEventHandler = (sliderName, settings, changeEvt) => {
  let minRange = changeEvt.value[0];
  let maxRange = changeEvt.value[1];
  let maxRangeDisplay = ((maxRange == settings.max) ? `${maxRange}+` : maxRange);
  let displayText = getText(`range-display-${sliderName}`, [minRange, maxRangeDisplay]);
  $(`#generated-${sliderName}-slider-display`).html(displayText);
  UsersAnswers[sliderName] = {
    min: minRange,
    max: maxRange
  }
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
  selectMultipleButton(question, selection)
}

function selectButton(question, selection) {
  // unselect previous choices
  $(`[id^="generated-quiz-modal-button_${question}"]`).removeClass('active');
  // select current choice
  $(`#generated-quiz-modal-button_${question}_${selection}`).addClass('active');
  //save the selection
  UsersAnswers[question] = selection;
  $quizContinueButton.prop('disabled', false);
}

function selectMultipleButton(question, selection) {
  if (UsersAnswers[question]) {
    if (UsersAnswers[question].includes(selection)) {
      // remove it from the list
      var index = UsersAnswers[question].indexOf(selection);
      if (index > -1) {
        UsersAnswers[question].splice(index, 1);
        $(`#generated-quiz-modal-button_${question}_${selection}`).removeClass('active');
      }
    } else {
      UsersAnswers[question].push(selection)
      $(`#generated-quiz-modal-button_${question}_${selection}`).addClass('active');
    }
  } else {
    UsersAnswers[question] = [];
    UsersAnswers[question].push(selection)
    $(`#generated-quiz-modal-button_${question}_${selection}`).addClass('active');
  }

  //if no answer, block the continue button
  if (UsersAnswers[question].length == 0) {
    $quizContinueButton.prop('disabled', true)
  } else {
    $quizContinueButton.prop('disabled', false)
  }
  console.log(UsersAnswers)
}

function nextQuestion() {
  console.log(UsersAnswers)
  // adjusts the display progress bar
  adjustProgressBar(CurrentQuestion);

  // see if we are on the last question
  if (CurrentQuestion == QUIZ_QUESTIONS.length) {
    $('#generated-quiz-modal-progress-label').html(getText('results'));
    $(`#generated-quiz-modal-question${CurrentQuestion}-container`).addClass("fade-out");
    $quizContinueButton.hide();
    $quizBackButton.hide();
    setTimeout(() => {
      $quizResultContainer.addClass('fade-in');
      $quizResultContainer.show();
      $(`#generated-quiz-modal-question${CurrentQuestion}-container`).hide();
      calculateQuizResult();
    }, 250);
  } else {

    // go to next question

    // slide out current question
    //$(`#generated-quiz-modal-question${CurrentQuestion}-container`).addClass("fade-in")

    // wait 250 ms before sliding in next question
    setTimeout(() => {
      $(`#generated-quiz-modal-question${CurrentQuestion}-container`).hide()
      // disable the continue button by default for this question
      $quizContinueButton.prop('disabled', true)
      // and unfocus it
      $quizContinueButton.blur()
      // enable or disable the continue button by default for the next question
      $quizContinueButton.prop('disabled', QUIZ_QUESTIONS[CurrentQuestion].disableContinueButtonByDefault)
      // increment the question
      CurrentQuestion += 1;
      // change the title
      $('#generated-quiz-modal-progress-label').html(getText("generated-quiz-modal-progress-label", [CurrentQuestion, QUIZ_QUESTIONS.length]));
      // slide in the next
      $(`#generated-quiz-modal-question${CurrentQuestion}-container`).addClass("fade-in")
      $(`#generated-quiz-modal-question${CurrentQuestion}-container`).show()
    }, 250);
  }
}

function lastQuestion() {
  // adjusts the display progress bar
  backProgressBar(CurrentQuestion);

  //Enable continue button immediately when going back
  $quizContinueButton.prop('disabled', false)

  // wait 250 ms before sliding back one question
  setTimeout(() => {
    $(`#generated-quiz-modal-question${CurrentQuestion}-container`).hide()
    // decrement the question
    CurrentQuestion -= 1;
    // change the title
    $('#generated-quiz-modal-progress-label').html(getText("generated-quiz-modal-progress-label", [CurrentQuestion, QUIZ_QUESTIONS.length]));
    // slide in the next
    $(`#generated-quiz-modal-question${CurrentQuestion}-container`).addClass("fade-in")
    $(`#generated-quiz-modal-question${CurrentQuestion}-container`).show()
  }, 250);
}

function restartQuiz() {
  for (var i = 0; i < 150; i++) {
    $(`.confetti-${i}`).remove();
  }
  $(`#main-container`).removeClass('wide-container');
  $(`#welcome-banner`).show();

  $quizResultContainer.removeClass('fade-in');
  $quizResultContainer.hide();

  
 
  // reset the global variables
  CurrentQuestion = 1;
  UsersAnswers = {};
  // get rid of unwanted effects
  $(`*`).removeClass(`fade-out`);
  $(`button.active`).removeClass(`active`);
  //initialization again
  BuildQuiz();
  assignJqueryElements();
  setupElements();
  setupCallbacks();
  // change the title
  $('#generated-quiz-modal-progress-label').html(getText("generated-quiz-modal-progress-label", [CurrentQuestion, QUIZ_QUESTIONS.length]));
  // show the first quiz container
  $(`#generated-question1-container`).addClass("fade-in")
  $(`#generated-question1-container`).show();
  // show the continue button
  $quizContinueButton.show();
  // adjust progress bar to first question
  adjustProgressBar(0);
}

function checkQuestion(questionNum) {
  //Check Question and enable/disable BACK Button
  if (questionNum == 1) {
    $quizBackButton.prop('disabled', true);
  }
  else {
    $quizBackButton.prop('disabled', false);
  }
}

function adjustProgressBar(index) {
  let questionNum = index + 1;
  $("#generated-quiz-modal-progress-bar").css("width", `${((questionNum) / QUIZ_QUESTIONS.length * 100)}%`);

  checkQuestion(questionNum);
}

function backProgressBar(index) {
  let questionNum = index - 1;
  $("#generated-quiz-modal-progress-bar").css("width", `${((questionNum) / QUIZ_QUESTIONS.length * 100)}%`);

  checkQuestion(questionNum);
}

function closeQuizModal() {
  $("#quiz-modal").modal('hide');
}

function animateElements() {
  $("#sm-circle").hide();
  $("#md-circle").hide();
  $("#lg-circle").hide();
  $('.detective').addClass('slide-in-bottom');
  $('.detective').css('opacity','100');
  setTimeout(()=>{
    $("#sm-circle").addClass('scale-up-center');
    $("#sm-circle").show();
    setTimeout(()=>{
      $("#md-circle").addClass('scale-up-center');
      $("#md-circle").show();
      setTimeout(()=>{
        $("#lg-circle").addClass('scale-up-center');
        $("#lg-circle").show();
        $("#welcome-text").css('opacity','100');
      },200)
    },200)
    setTextAnimation();
  },250)

  /**
   * disabling page animations for now
   *   $("#bg-rectangle").addClass("bounce-in-top");
  $("#bg-rectangle").show();
  $("#dancing-jinri").addClass("slide-in-right");
  $("#dancing-jinri").show();
  $("#logo-container").addClass("slide-in-blurred-left")
  $("#start-quiz-button").addClass("fade-in");
  $("#start-quiz-button-modal").addClass("fade-in");
  $("#welcome-text").addClass("swing-in-left-fwd")
   */

}

const ERASE = "erase";
const WRITE = "write";
let textEraseAnimationTimer;
let words;
let currentWord;
let currentDirection = WRITE;
let wordListIndex = 0;
let delay = false;
let addedQuestionMark = false;

const matchesMade = 2000;
let currentMatchesMade = 0;

function setTextAnimation() {
  clearInterval(textEraseAnimationTimer);
  words = getText('animated-words');
  currentWord = words[wordListIndex];
  textEraseAnimationTimer = setInterval(eraseAndWriteText, 33);
}

function eraseAndWriteText() {
  // we wait a bit before erasing
  if (delay) {
    return;
  }

  if (addedQuestionMark) {
    keyword.innerHTML = currentWord;
    addedQuestionMark = false;
    return
  }

  // get text thats displayed right now
  var remainingText = keyword.innerHTML;
  // get the length of it
  var l = remainingText.length;
  // if theres some characters in it
  if (currentDirection == 'erase') {
    if (l > 0) {
      // then erase 1 character
      keyword.innerHTML = remainingText.substring(0, l - 1);
    } else {
      currentDirection = 'write';
      wordListIndex += 1;
      // no characters, change to next word
      if (wordListIndex == words.length) {
        wordListIndex = 0;
      }
      // get a new word to animate
      currentWord = words[wordListIndex];
    }
  } else {
    // if we have not written the whole word yet
    if (l < currentWord.length) {
      // write 1 character
      keyword.innerHTML += currentWord.charAt(l);
    } else {
      // done writing the word, so add black question mark and delay a bit
      // the mockup UI has the question mark as black, so we must also 
      // remove the question mark from the localization files. 
      keyword.innerHTML += `<span class="dark-text">?</span>`;
      addedQuestionMark = true;
      delay = true;
      setTimeout(() => {
        delay = false;
        currentDirection = 'erase';
      }, 800)
    }

  }
}

//retreives the language's icon to display on the dropdown menu.
function getLanguageIcon(language) {
  // hack to return globe image
  return './images/globe.png';
  if (ICONS[language]) {
    return ICONS[language]
  }
  return '';
}

// Inserts values from an array into a string
// use [*] to mark a place in text where a value should be inserted.
// example text: "Between [*] and [*] average viewers",
// the two placeholders will be replaced in order,
// from the values in the values array.  
function insertValuesIntoText(text, values) {
  let completeText = "";
  const PLACEHOLDER = "[*]";
  const MISSING_VALUE = "[missing]";
  let valuesToInsert = 0;
  for (let index = 0; index < text.length; index++) {
    // we are looking for substrings that are formatted lke this: [*]
    let str = text.substring(index, index + 3);
    if (str == PLACEHOLDER) {
      // keeping track of how many placeholders we find in the text
      valuesToInsert += 1;
    }
  }
  // for each placeholder we replace it with a value from the array
  for (let valueIndex = 0; valueIndex < valuesToInsert; valueIndex++) {
    if (values[valueIndex]) {
      completeText = text.replace(PLACEHOLDER, values[valueIndex])
    } else {
      // if the value array doesn't have enough values to insert, it's replaced with an error text
      //hack to make the slider work because when values[valueIndex] is 0 it is counted as false
      if(values[valueIndex]===0){
        completeText = text.replace(PLACEHOLDER, '0')
      } else {
        completeText = text.replace(PLACEHOLDER, MISSING_VALUE)
      }

    
    }
    // sets the updated version of the text, containing 1 less placeholder
    text = completeText;
  }

  return completeText;
}

// Replaces the old getTranslation() function, this one reads the 
// text from the JSON object we received from the server.
function getText(label, params = []) {
  // check if there is translation for this label, then use it
  if (TEXTS[label]) {
    // if there are params to insert
    if (params.length > 0) {
      // insert the values into the string
      return insertValuesIntoText(TEXTS[label], params);
    }
    //else just return the entire text
    return TEXTS[label];
  }
  return sadKEK(label, 'missing label');
}

function setLanguage(language) {
  _CURRENT_LANGUAGE_ = language;
}

function getLanguage() {
  return _CURRENT_LANGUAGE_;
}

function calculateQuizResult() {
 
  // Send the results to the server
  $.ajax({
    beforeSend: console.log(`sending answers...`),
    url: "/calculateStreamer",
    type: "POST",
    data: { UsersAnswers },
    success: function (data) {
    
      console.log(data)


      setTimeout(() => {
        $(`#welcome-banner`).hide();

        $("#generated-quiz-modal").modal('hide');
        if (data.Error != null) {
          console.log(data.Error.message)
          $streamerRevealContainer.show()
        } else {
          console.log(data.Results);
          $(`#main-container`).addClass('wide-container');
          displayStreamerResults(data.Results);
          $streamerRevealContainer.addClass("fade-in");
          $streamerRevealContainer.show();
          $quizRestartButton.show();
          console.log("complete.")
        }

      }, 2500)
    },
    complete: function (xhr, status) {
      if (status == 'error') {
        console.log('error')
      }
    }
  });
}

function displayStreamerResults(results) {
  var streamers = results.result;
  ResultStats = results.stats;
  streamers.forEach((streamer, index) => {
    $(`#streamer-${index + 1}-user_name`).text(streamer.user_name);
    $(`#streamer-${index + 1}-logo`).attr('src', streamer.logo);
    $(`#streamer-${index + 1}-match`).text(streamer.match_value);
    $(`#streamer-${index + 1}-twitch_link`).attr("href", `https://twitch.tv/${streamer.user_name}`);
    $($(".streamer-info-container").get(index)).attr("streamer_id", streamer.id);
  });
  for (var i = 0; i < 150; i++) {
    create(i);
  }

  function create(i) {
    var width = Math.random() * 8;
    var height = width * 0.4;
    var colourIdx = Math.ceil(Math.random() * 3);
    var colour = "red";
    switch (colourIdx) {
      case 1:
        colour = "yellow";
        break;
      case 2:
        colour = "blue";
        break;
      default:
        colour = "red";
    }
    $('<div class="confetti-' + i + ' ' + colour + '"></div>').css({
      "width": width + "px",
      "height": height + "px",
      "top": -Math.random() * 20 + "%",
      "left": Math.random() * 100 + "%",
      "opacity": Math.random() + 0.5,
      "transform": "rotate(" + Math.random() * 360 + "deg)"
    }).appendTo('.confetti-container');

    drop(i);
  }

  function drop(x) {
    $('.confetti-' + x).animate({
      top: "100%",
      left: "+=" + Math.random() * 15 + "%"
    }, Math.random() * 2000 + 2000, function () {
      reset(x);
    });
  }

  function reset(x) {
    $('.confetti-' + x).animate({
      "top": -Math.random() * 20 + "%",
      "left": "-=" + Math.random() * 15 + "%"
    }, 0, function () {
      drop(x);
    });
  }
}

function captureTimeInputs() {
  var offset = new Date().getTimezoneOffset();
  QUIZ_QUESTIONS.forEach(question => {
    if (question.question_type == QuestionTypes.TimeRange) {
      let timeObj = {}
      question.answer_settings.forEach(timeRange => {
        timeObj[timeRange.value_name] = ($(`#generated-switch_${question.unique_question_identifier}_${timeRange.value_name}`).prop("checked") == true);
        timeObj[`${timeRange.value_name}From`] = $(`#generated-${question.unique_question_identifier}-${timeRange.value_name}-from`).val();
        timeObj[`${timeRange.value_name}To`] = $(`#generated-${question.unique_question_identifier}-${timeRange.value_name}-to`).val();
      })
      timeObj.userOffsetMinute = offset * -1;
      UsersAnswers[question.unique_question_identifier] = timeObj;
    }
  })

}

function setupStatsTooltipHover() {
  $(".streamer-info-container").tooltip({
    placement: "right",
    sanitize: false,
    html: true,
    title: function () {
      var el = $(this);
      var id = el.attr("streamer_id");
      if (!(id in ResultStats)) {
        return ""
      }

      var tooltip = "<table style='text-align: left'>";
      for (var k in ResultStats[id]) {
        var v = ResultStats[id][k];
        var kColor = statsTooltipColor(v);
        tooltip += "<tr>";
        tooltip += "<td>" + k + "</td>";
        tooltip += "<td>:</td>";
        tooltip += "<td style='color:" + kColor + "'>" + v + "%</td>";
        tooltip += "</tr>";
      }
      tooltip += "</table>";
      return tooltip
    },
  })
}

function statsTooltipColor(v) {
  if (v >= 70) {
    return "#1df51d"
  } else if (v < 30) {
    return "#f52525"
  }
  return "white"
}
