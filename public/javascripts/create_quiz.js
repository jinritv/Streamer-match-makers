/*

New questions can be added to the quiz by adding a 
new object to the QUIZ_QUESTIONS array.

QuestionsTypes act as enums and represent
the type of inputs we need to answer the question.

Right now there are only 3 different types: 
- MultipleSelection: these are questions where we are
  given multiple options and we can select as many as
  we want, like the 'language' question or 'content'
  questions.
   
- RangeSlider: this is a slider where we choose a range
  between a minimum and maximum value, such as the 'age'
  question or the 'average viewer' question.

- TimeRange: this is a question where we select a 'From' value and
  a 'To' value, to create a range within those two times. We use two
  of these inputs in the case of our 'watch time' question. 

NOTE: the 'answer_settings' property is different
  depending on the type of question.

 */
const QuestionTypes = {
  MultipleSelection: "multipleselection",
  RangeSlider: "rangeslider",
  TimeRange: "timerange"
}

// Specific settings for each type of question
const QuestionTypeSettings = {
  [QuestionTypes.MultipleSelection]: {
    buttonsPerRow: 4 // buttons to put on a single row before making a new row           
  },
  [QuestionTypes.RangeSlider]: {},
  [QuestionTypes.TimeRange]: {}
}

// the quiz's questions will be built and displayed in the order they appear in this array
const QUIZ_QUESTIONS = [
  // Question 1: 'languages'
  {
    unique_question_identifier: "languages", //unique name for this question
    displayed_question: "Spoken languages?", // text to display to ask the question
    question_type: QuestionTypes.MultipleSelection, // type of question as explained above
    disableContinueButtonByDefault: true, // does the 'Continue' button get disabled by default?
    answer_settings: [ // answer_settings is where we put in any information needed to answer the question.
      {
        display_name: "English",
        value: "english"
      },
      {
        display_name: "Korean",
        value: "korean"
      },
      {
        display_name: "Japanese",
        value: "japanese"
      },
      {
        display_name: "Chinese",
        value: "chinese"
      },
      {
        display_name: "French",
        value: "french"
      },
      {
        display_name: "Spanish",
        value: "spanish"
      },
    ],
  },

  // Question 2: 'content'
  {
    unique_question_identifier: "content",
    displayed_question: "I prefer streamers who stream...",
    question_type: QuestionTypes.MultipleSelection,
    disableContinueButtonByDefault: true,
    answer_settings: [
      {
        display_name: "Just Chatting",
        value: "justchatting"
      },
      {
        display_name: "Games",
        value: "games"
      },
      {
        display_name: "ASMR",
        value: "ASMR"
      },
      {
        display_name: "Science & Technology",
        value: "sciencetech"
      },
      {
        display_name: "Food",
        value: "food"
      },
      {
        display_name: "Cooking",
        value: "cooking"
      },
      {
        display_name: "Outdoors",
        value: "outdoors"
      },
      {
        display_name: "IRL",
        value: "irl"
      },
      {
        display_name: "Movies with Viewers",
        value: "movies"
      },
      {
        display_name: "Music",
        value: "music"
      },
      {
        display_name: "Dancing",
        value: "dancing"
      },
      {
        display_name: "Yoga",
        value: "yoga"
      },
    ],
  },

  // Question 3: 'average_viewers'
  {
    unique_question_identifier: "average_viewers",
    displayed_question: "Average viewer count?",
    question_type: QuestionTypes.RangeSlider,
    disableContinueButtonByDefault: false,
    answer_settings: {
      slider_label_default: "Between 2500 and 7500 average viewers",
      min: 0,
      max: 10000,
      suffix: "average viewers",
      incrementBy: 50
    },
  },

  // Question 4: 'age'
  {
    unique_question_identifier: "age",
    displayed_question: "I prefer streamers of the age",
    question_type: QuestionTypes.RangeSlider,
    disableContinueButtonByDefault: false,
    answer_settings: {
      slider_label_default: "Between 25 and 75 years old",
      min: 16,
      max: 100,
      suffix: "years old",
      incrementBy: 1
    },
  },

  // Question 5: 'watchtime'
  {
    displayed_question: "I can watch streams on",
    question_type: QuestionTypes.TimeRange,
    disableContinueButtonByDefault: false,
    unique_question_identifier: "watchtime",
    answer_settings: [{
      display_name: "Weekdays",
      value_name: "weekdays",
      minDefault: "9:30",
      maxDefault: "17:30",
    },
    {
      display_name: "Weekends",
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
            <h5 class="modal-title w-100" id="generated-quiz-modal-progress-label">Question 1 of ${QUIZ_QUESTIONS.length}</h5>
          </div>
              ${generateProgressBar(QUIZ_QUESTIONS.length)}
          <div class="modal-body">
            <div class="d-flex flex-column">
              ${generateQuestionsHtml()}
            <div id="generated-question-result-container">
              <div class="row mb-3 justify-content-center">
              <img style="width:50%;height:50%" src="/images/mascot.png"/>
             
              </div>
              <div class="row justify-content-center align-items-center">
                <div class="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <h4>Matching you with a streamer...</h4>
                <div class="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
         
            <div id="generated-streamer-reveal-container" class="container">
              <div class="row mb-3 justify-content-center">
             
                <div class="col justify-content-center">
                  <div class="container streamer-info-container" style="width: 60%;">
                    <div class="row">
                      <div class="col">
                        <div style="border-radius: 50%; border-color:#DAB9DF;
                        border-width: 2px; height:60px; width:60px; margin-bottom: 24px; margin-top:12px; overflow: hidden;">
                          <img id="streamer-1-logo" style="max-width: 100%; max-height: 100%;"
                            src="https://static-cdn.jtvnw.net/jtv_user_pictures/e0bbc79b-7c05-473b-a95c-508cd88c5991-profile_image-300x300.png" />
                        </div>
                      </div>
                      <div class="col">
                        <div class="float-right" style="padding-top: 12px;"><span><strong style="color: #009900;" id="streamer-1-match">98</strong>% match</span></div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <div>
                         <span id="streamer-1-user_name" >JinriTV</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="float-right" style="height:30px; width:30px; ">
                          <a  id="streamer-1-twitch_link">
                            <img style="max-width: 100%; max-height: 100%; padding-bottom: 12px;"
                            src="/images/twitch_PNG48.png" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <div class="container streamer-info-container">
                    <div class="row">
                      <div class="col">
                        <div style="border-radius: 50%; border-color:#DAB9DF;
                        border-width: 2px; height:60px; width:60px; margin-bottom: 24px; margin-top:12px; overflow: hidden;">
                          <img id="streamer-2-logo" style="max-width: 100%; max-height: 100%;"
                            src="https://static-cdn.jtvnw.net/jtv_user_pictures/e0bbc79b-7c05-473b-a95c-508cd88c5991-profile_image-300x300.png" />
                        </div>
                      </div>
                      <div class="col">
                        <div class="float-right" style="padding-top: 12px;"><span><strong id="streamer-2-match">98</strong>% match</span></div>
                      </div>
                    </div>
                    <div class="row" style="padding-bottom: 12px;">
                      <div class="col">
                        <div>
                         <span id="streamer-2-user_name" >JinriTV</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="float-right" style="height:30px; width:30px; ">
                          <a  id="streamer-2-twitch_link">
                            <img style="max-width: 100%; max-height: 100%; padding-bottom: 12px;"
                            src="/images/twitch_PNG48.png" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="container streamer-info-container">
                    <div class="row">
                      <div class="col">
                        <div style="border-radius: 50%; border-color:#DAB9DF;
                        border-width: 2px; height:60px; width:60px; margin-bottom: 24px; margin-top:12px; overflow: hidden;">
                          <img  id="streamer-3-logo"  style="max-width: 100%; max-height: 100%;"
                            src="https://static-cdn.jtvnw.net/jtv_user_pictures/e0bbc79b-7c05-473b-a95c-508cd88c5991-profile_image-300x300.png" />
                        </div>
                      </div>
                      <div class="col">
                        <div class="float-right" style="padding-top: 12px;"><span><strong id="streamer-3-match">98</strong>% match</span></div>
                      </div>
                    </div>
                    <div class="row" style="padding-bottom: 12px;">
                      <div class="col">
                        <div>
                         <span id="streamer-3-user_name" >JinriTV</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="float-right" style="height:30px; width:30px; ">
                          <a  id="streamer-3-twitch_link">
                            <img style="max-width: 100%; max-height: 100%; padding-bottom: 12px;"
                            src="/images/twitch_PNG48.png" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="container streamer-info-container">
                    <div class="row">
                      <div class="col">
                        <div style="border-radius: 50%; border-color:#DAB9DF;
                        border-width: 2px; height:60px; width:60px; margin-bottom: 24px; margin-top:12px; overflow: hidden;">
                          <img id="streamer-4-logo"  style="max-width: 100%; max-height: 100%;"
                            src="https://static-cdn.jtvnw.net/jtv_user_pictures/e0bbc79b-7c05-473b-a95c-508cd88c5991-profile_image-300x300.png" />
                        </div>
                      </div>
                      <div class="col">
                        <div class="float-right" style="padding-top: 12px;"><span><strong id="streamer-4-match">98</strong>% match</span></div>
                      </div>
                    </div>
                    <div class="row" style="padding-bottom: 12px;">
                      <div class="col">
                        <div>
                         <span id="streamer-4-user_name" >JinriTV</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="float-right" style="height:30px; width:30px; ">
                          <a  id="streamer-4-twitch_link">
                            <img style="max-width: 100%; max-height: 100%; padding-bottom: 12px;"
                            src="/images/twitch_PNG48.png" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="container streamer-info-container">
                    <div class="row">
                      <div class="col">
                        <div style="border-radius: 50%; border-color:#DAB9DF;
                        border-width: 2px; height:60px; width:60px; margin-bottom: 24px; margin-top:12px; overflow: hidden;">
                          <img id="streamer-5-logo"  style="max-width: 100%; max-height: 100%;"
                            src="https://static-cdn.jtvnw.net/jtv_user_pictures/e0bbc79b-7c05-473b-a95c-508cd88c5991-profile_image-300x300.png" />
                        </div>
                      </div>
                      <div class="col">
                        <div class="float-right" style="padding-top: 12px;"><span><strong id="streamer-5-match">98</strong>% match</span></div>
                      </div>
                    </div>
                    <div class="row" style="padding-bottom: 12px;">
                      <div class="col">
                        <div>
                         <span id="streamer-5-user_name" >JinriTV</span>
                        </div>
                      </div>
                      <div class="col"> 
                          <div class="float-right" style="height:30px; width:30px; ">
                            <a  id="streamer-5-twitch_link">
                              <img style="max-width: 100%; max-height: 100%; padding-bottom: 12px;"
                              src="/images/twitch_PNG48.png" />
                            </a>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
          <div class="modal-footer justify-content-center" style="position: relative;">
            <button id="restart-button" type="button" onclick="restartQuiz()"
                class="btn btn-quiz-answer btn-quiz-continue">
            <span>Restart</span></button>
          </div>
          <div class="modal-footer justify-content-center">
            <button id="continue-button" type="button" onclick="nextQuestion()"
                class="btn btn-quiz-answer btn-quiz-continue">
              <span>Continue</span>
            </button>
          </div>
        </div>
      </div>`;

  $(`#generated-quiz-modal`).html(quizHtml);
}

// Thhe main functions that build the inputs for each question
const GenerateQuestionInputs = {
  [QuestionTypes.MultipleSelection]: (question) => {
    let htmlString =
      `<div class="d-flex flex-row mb-3 justify-content-center">
            <h4>${question.displayed_question}</h4>
        </div>`;

    let newRowHtml = `<div class="d-flex flex-row mb-3 justify-content-center quiz-button-container">`;
    let closeRowHtml = `</div>`;

    let numInCurrentRow = 0; // keeps track of how many buttons are on the current row
    htmlString += newRowHtml; // create a new row to start
    question.answer_settings.forEach((answer, indx) => {
      // check if we can add this button to the current row, or we need to make a new row
      if (numInCurrentRow >= QuestionTypeSettings[question.question_type].buttonsPerRow) {
        // close the row
        htmlString += closeRowHtml;
        // and open a new one
        htmlString += newRowHtml;
        // reset the row counter
        numInCurrentRow = 0;
      }
      // add the button html to the rest of the html
      htmlString += `<button id="generated-quiz-modal-button_${question.unique_question_identifier}_${answer.value}" type="button" onclick="selectMultipleButton('${question.unique_question_identifier}','${answer.value}')"
             class="btn btn-quiz-answer">
             <span>${answer.display_name}</span>
           </button>`;

      numInCurrentRow += 1;
    })
    htmlString += closeRowHtml; // close the row now
    return htmlString;
  },
  [QuestionTypes.RangeSlider]: (question) => {
    let htmlString = `<div class="d-flex flex-column mb-3 justify-content-center text-center">
        <h4>${question.displayed_question}</h4>
        <span id="generated-${question.unique_question_identifier}-slider-display">${question.answer_settings.slider_label_default}</span>
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
        <h4>${question.displayed_question}</h4>
      </div><div class="d-flex flex-column mb-3"><div class="d-flex flex-row mb-3 justify-content-center">`;
    question.answer_settings.forEach(answerTime => {
      htmlString += `<div class="custom-control custom-switch" style="margin-right:48px;">
          <input type="checkbox" class="custom-control-input" id="generated-switch_${question.unique_question_identifier}_${answerTime.value_name}"
            onclick="toggleTimeInput('${question.unique_question_identifier}','${answerTime.value_name}'); captureTimeInputs()">
          <label class="custom-control-label" for="generated-switch_${question.unique_question_identifier}_${answerTime.value_name}">${answerTime.display_name}</label>
        </div>`;
    })
    htmlString += `</div><div class="d-flex flex-row mb-3 justify-content-center">`;
    question.answer_settings.forEach(answerTime => {
      htmlString += `<div id="generated-${question.unique_question_identifier}-${answerTime.value_name}" style="position: relative;">
          <div class="d-flex flex-column text-center">
            <span style="color:#bf7dd3"><strong>${answerTime.display_name}</strong></span>
            <span>from</span>
            <input id="generated-${question.unique_question_identifier}-${answerTime.value_name}-from" class="time text-center" type="text" value="${answerTime.minDefault}" />
            <span>to</span>
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
  const closingHtml = `</div>`;
  QUIZ_QUESTIONS.forEach((question, index) => {
    let questionNum = index + 1;
    const openingHtml = `<div id="generated-quiz-modal-question${questionNum}-container" style="z-index: 1;">`;
    let questionHtml = openingHtml + GenerateQuestionInputs[question.question_type](question) + closingHtml;
    allQuestions += questionHtml;
  });
  return allQuestions;
}

function generateProgressBar(numOfQuestions) {
  let openingHtml = `<div class="progress">`;
  let progressBarHtml = ``;
  let questionPercentage = 100 / numOfQuestions;
  let closingHtml = `<div id="generated-quiz-modal-progress-bar" class="progress-bar" role="progressbar" style="width: ${questionPercentage}%;"><span></span></div></div>`;
  for (let question = 1; question <= numOfQuestions; question++) {
    let checkpointSize = questionPercentage * question;
    let left = 100 - checkpointSize;
    // without this check, the beginning of the progress bar has a checkpoint as well
    // and it cuts off the rounded edge so we remove it to look nicer
    if (left != 0) {
      progressBarHtml += `<div id="generated-quiz-modal-progress-bar-${question}" class="progress-bar-checkpoint" style="left:${left}%"><span></span></div>`
    }

  }
  return openingHtml + progressBarHtml + closingHtml;
}
