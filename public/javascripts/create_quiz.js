/*
New questions can be added to the quiz by adding a 
new object to the QUIZ_QUESTIONS array.

The "Buttons" question types MultipleSelection and SingleSelection are 
functionally the same, and the only difference is the function we call when 
the button is pushed. Because single selection we have to de-select 
other options when an option is chosen, and for multiple selection
we can allow more than 1 button active at a given time. 

 */
const QuestionTypes = {
  Buttons: {
    MultipleSelection: "multipleselection",
    SingleSelection: "singleselection",
  },
  RangeSlider: "rangeslider",
  TimeRange: "timerange",
}

// Specific settings for each type of question
const QuestionTypeSettings = {
  [QuestionTypes.Buttons.MultipleSelection]: {
    buttonsPerRow: 4, // buttons to put on a single row before making a new row
    onclickFunctionName: 'selectMultipleButton' // name of the function to run in the onclick handler
  },
  [QuestionTypes.Buttons.SingleSelection]: {
    buttonsPerRow: 1,  
    onclickFunctionName: 'selectButton'
  },
  [QuestionTypes.RangeSlider]: {
    // no default settings for this type of question
  },
  [QuestionTypes.TimeRange]: {
    // no default settings for this type of question
  },
}

// the quiz's questions will be built and displayed in the order they appear in this array
const QUIZ_QUESTIONS = [
  // Question 1: 'languages'
  {
    unique_question_identifier: "languages", //unique name for this question
    question_type: QuestionTypes.Buttons.MultipleSelection, // type of question as explained above
    disableContinueButtonByDefault: true, // should the 'Continue' button get disabled when the question is displayed (is the it instantly skippable?)
    buttonsPerRow: 3, // if you include this property, you override the default buttons per row
    onclickFunctionName: 'exampleOnClickFunction', // you can override the function that is called when the button is pressed
    answer_settings: [ // list values for the answers here
      "english",
      "korean",
      "japanese",
      "chinese",
      "french",
      "spanish"
    ],
  },

  // Question 2: 'content'
  {
    unique_question_identifier: "content",
    question_type: QuestionTypes.Buttons.MultipleSelection,
    disableContinueButtonByDefault: true,
    answer_settings: [
      "justchatting",
      "games",
      "ASMR",
      "sciencetech",
      "food",
      "cooking",
      "outdoors",
      "irl",
      "movies",
      "music",
      "dancing",
      "yoga"
    ],
  },

  //Question 3: Follower/Sub only chat?
  {
    unique_question_identifier: "subonly",
    question_type: QuestionTypes.Buttons.SingleSelection,
    disableContinueButtonByDefault: true,
    answer_settings: [
      "all",
      "sub-only",
      "follower-only"
    ]
  },

  //Question 4: Mature
  {
    unique_question_identifier: "mature",
    question_type: QuestionTypes.Buttons.SingleSelection,
    disableContinueButtonByDefault: true,
    answer_settings: [ true, false ]
  },

  // Question 5: chat vibes
  {
    unique_question_identifier: "chat-vibe",
    question_type: QuestionTypes.Buttons.MultipleSelection,
    disableContinueButtonByDefault: false,
    buttonsPerRow: 5,
    answer_settings: [
      "chatty",
      "chill",
      "serious",
      "smart",
      "funny",
      "friendly",
      "moody",
      "weird",
      "geeky",
      "shy",
      "silly",
      "rude",
      "dorky",
      "angry",
      "loud",
      "quiet",
      "troll",
      "drunk",
      "spam-emotes",
      "fast",
      "slow",
      "wholesome",
      "toxic"
    ]
  },

  // Question 6: average_viewers
  {
    unique_question_identifier: "average_viewers",
    question_type: QuestionTypes.RangeSlider,
    disableContinueButtonByDefault: false,
    answer_settings: {
      min: 0,
      max: 1000,
      incrementBy: 50,
      defaultMin: 250,
      defaultMax: 750
    },
  },

  // Question 7: 'watchtime'
  {
    unique_question_identifier: "watchtime",
    question_type: QuestionTypes.TimeRange,
    disableContinueButtonByDefault: false,
    answer_settings: [{
      value_name: "weekdays",
      minDefault: "9:30",
      maxDefault: "17:30",
    },
    {
      value_name: "weekends",
      minDefault: "9:30",
      maxDefault: "17:30",
    },
    ],
  },
];

// This is the first function called on page load, it is what creates
// the HTML for the quiz pages, based off the QUIZ_QUESTIONS array.
function BuildQuiz() {
  let quizHtml = `<div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header text-center">
            <h5 class="modal-title w-100" id="generated-quiz-modal-progress-label">${getText("generated-quiz-modal-progress-label", [CurrentQuestion, QUIZ_QUESTIONS.length])}</h5>
          </div>
              ${generateProgressBar(QUIZ_QUESTIONS.length)}
          <div class="modal-body">
            <div class="d-flex flex-column">
              ${generateQuestionsHtml()}
            <div id="generated-question-result-container">
              ${HTMLStrings.LoadingScreen()}
            </div>
            </div>
          </div>
          ${HTMLStrings.ModalFooter()}
        </div>
      </div>`;
  $(`#generated-quiz-modal`).html(quizHtml);
  $(`#generated-result-page`).html(CreateResultPage())
}

function CreateResultPage(){
  return `<div id="generated-streamer-reveal-container" class="container-fluid">
  <div class="row mb-3 justify-content-center">
  <h4>These are your top</h4>
  
  </div>
  <div class="row mb-3 justify-content-center">
  <h3>Matches</h3>
  </div>
  <div class="row mb-3 justify-content-center">
  <div class="col">
  <div class="streamer-info-container others">
    ${HTMLStrings.OtherStreamer(2)}
  </div>
</div>
<div class="col">
  <div class="streamer-info-container others">
    ${HTMLStrings.OtherStreamer(3)}
  </div>
</div>
    <div class="col justify-content-center">
     ${HTMLStrings.FirstPlaceStreamer()}
    </div>
    <div class="col">
    <div class="streamer-info-container others">
      ${HTMLStrings.OtherStreamer(4)}
    </div>
  </div>
  <div class="col">
    <div class="streamer-info-container others">
      ${HTMLStrings.OtherStreamer(5)}
    </div>
  </div>
  </div>
  <div class="row">
  <div class="col"></div>
  <div class="col" style="text-align:center;">
  <button id="restart-button" type="button" onclick="restartQuiz()"
  class="btn btn-quiz-answer btn-quiz-restart">
<span>${getText('restart')}</span></button>
  </div>
  <div class="col"></div>
 
  </div>
</div>`
}

function GenerateQuestionInputs(question) {
  let questionType = (Object.values(QuestionTypes.Buttons).includes(question.question_type)) ? 'buttonselect' : question.question_type;
  return generateInputFunctions[questionType](question);
}

// Thhe main functions that build the inputs for each question
const generateInputFunctions = {
  'buttonselect': (question) => {
    let htmlString = HTMLStrings.BasicQuestionTitle(getText(`question-text-${question.unique_question_identifier}`));
    let numInCurrentRow = 0; // keeps track of how many buttons are on the current row
    // check if we have overidden the number of buttons per row
    // if we have not overriden it, it will use the default for that question type's settings.
    let buttonsPerRow = (question.buttonsPerRow ? question.buttonsPerRow : QuestionTypeSettings[question.question_type].buttonsPerRow);
    htmlString += HTMLStrings.NewButtonRowOpen; // create a new row to start
    question.answer_settings.forEach((answer, indx) => {
      // check if we can add this button to the current row, or we need to make a new row
      if (numInCurrentRow >= buttonsPerRow) {
        // close the row
        htmlString += HTMLStrings.NewButtonRowClose;
        // and open a new one
        htmlString += HTMLStrings.NewButtonRowOpen;
        // reset the row counter
        numInCurrentRow = 0;
      }
      // check if onlickFunction is overridden for this question
      let onclickFunctionName = question.onclickFunctionName ? question.onclickFunctionName : QuestionTypeSettings[question.question_type].onclickFunctionName;
      // add the button html to the rest of the html
      htmlString += HTMLStrings.BasicAnswerButton(question, answer, onclickFunctionName);

      numInCurrentRow += 1;
    })
    htmlString += HTMLStrings.NewButtonRowClose; // close the row now
    return htmlString;
  },
  [QuestionTypes.RangeSlider]: (question) => {
    let defaultDisplayValues = [question.answer_settings.defaultMin,question.answer_settings.defaultMax];
    let htmlString = `<div class="d-flex flex-column mb-3 justify-content-center text-center">
        <h4>${getText(`question-text-${question.unique_question_identifier}`)}</h4>
        <span id="generated-${question.unique_question_identifier}-slider-display">${getText(`range-display-${question.unique_question_identifier}`,defaultDisplayValues)}</span>
      </div>     
      <div class="d-flex flex-row justify-content-center quiz-slider-container">
      <div id='generated-${question.unique_question_identifier}-minus' class="btn btn-outline-light svg-buttons" style="margin-right: 24px;">
        <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <line x1='0' y1='30' x2='60' y2='30' stroke='#C4C4C4' style="stroke-width: 6px;" />
        </svg>
      </div>
      <div style="display:flex;align-items:center;">
        <input id="generated-slider_${question.unique_question_identifier}" type="text" />
      </div>
      <div id='generated-${question.unique_question_identifier}-plus' tabindex="0" class="btn btn-outline-light svg-buttons"
        style="margin-left:24px;">
        <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <line x1='0' y1='30' x2='60' y2='30' stroke='#C4C4C4' style="stroke-width: 6px;" />
          <line x1='30' y1='0' x2='30' y2='60' stroke='#C4C4C4' style="stroke-width: 6px;" />
        </svg>
      </div>
    </div>`;
    return htmlString;
  },
  [QuestionTypes.TimeRange]: (question) => {
    let htmlString = `<div class="d-flex flex-row mb-3 justify-content-center">
        <h4>${getText(`question-text-${question.unique_question_identifier}`)}</h4>
      </div><div class="d-flex flex-column mb-3"><div class="d-flex flex-row mb-3 justify-content-center">`;
    question.answer_settings.forEach(answerTime => {
      htmlString += `<div class="custom-control custom-switch" style="margin-right:48px;">
          <input type="checkbox" class="custom-control-input" id="generated-switch_${question.unique_question_identifier}_${answerTime.value_name}"
            onclick="toggleTimeInput('${question.unique_question_identifier}','${answerTime.value_name}'); captureTimeInputs()">
          <label class="custom-control-label" for="generated-switch_${question.unique_question_identifier}_${answerTime.value_name}">${getText(`time-range-${question.unique_question_identifier}-${answerTime.value_name}`)}</label>
        </div>`;
    })
    htmlString += `</div><div class="d-flex flex-row mb-3 justify-content-center">`;
    question.answer_settings.forEach(answerTime => {
      htmlString += `<div id="generated-${question.unique_question_identifier}-${answerTime.value_name}" style="position: relative;">
          <div class="d-flex flex-column text-center">
            <span style="color:#bf7dd3"><strong>${getText(`time-range-${question.unique_question_identifier}-${answerTime.value_name}`)}</strong></span>
            <span class="time-label">${getText(`time-range-${question.unique_question_identifier}-from`)}</span>
            <input id="generated-${question.unique_question_identifier}-${answerTime.value_name}-from" class="time text-center" type="text" value="${answerTime.minDefault}" />
            <span class="time-label">${getText(`time-range-${question.unique_question_identifier}-to`)}</span>
            <input id="generated-${question.unique_question_identifier}-${answerTime.value_name}-to" class="time text-center" type="text" value="${answerTime.maxDefault}" />
          </div>
        </div>`;
    })
    htmlString += `</div></div>`;
    return htmlString;
  },
}

function generateQuestionsHtml() {
  let allQuestions = ``;
  QUIZ_QUESTIONS.forEach((question, index) => {
    let questionNum = index + 1;
    let questionHtml = HTMLStrings.QuestionContainerOpen(questionNum) 
      + GenerateQuestionInputs(question) 
      + HTMLStrings.QuestionSearchWeight(questionNum)
      + HTMLStrings.QuestionContainerClose;
    allQuestions += questionHtml;
  });
  return allQuestions;
}

function generateProgressBar(numOfQuestions) {
  let progressBarHtml = ``;
  let questionPercentage = 100 / numOfQuestions;
  for (let questionNum = 1; questionNum <= numOfQuestions; questionNum++) {
    let checkpointSize = questionPercentage * questionNum;
    let left = 100 - checkpointSize;
    // without this check, the beginning of the progress bar has a checkpoint as well
    // and it cuts off the rounded edge so we remove it to look nicer
    if (left != 0) {
      progressBarHtml += HTMLStrings.ProgressBarCheckpoint(questionNum, left)
    }
  }
  return HTMLStrings.ProgressBarOpen + progressBarHtml + HTMLStrings.ProgressBarClose(questionPercentage);
}
