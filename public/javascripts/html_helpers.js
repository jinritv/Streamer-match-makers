// Is there a better way to store this html?
const HTMLStrings = {
    LanguageDropDownItem: (language,icon,name) => (`<div class="dropdown-item-container"><a id="generated-dropdown-option-${language}" onclick="updateLanguage('${language}')" class="dropdown-item language-dropdown" href="#"><span class="language-dropdown-text">${name}</span></a></div>`),
    LanguageDropDown: (languageIcon,languageDisplayName,dropDownOptions) => (`<div id="language-dropdown" class="btn-group">
    <button type="button" class="btn btn-dropdown dropdown-toggle" data-toggle="dropdown"
    aria-haspopup="true" aria-expanded="false"><img class="dropdown-lang-icon" id="current-language-icon" src="${languageIcon}"/><span class="language-dropdown-text" id="current-language-label">${languageDisplayName}</span></button>
  
    <div class="dropdown-menu">
      ${dropDownOptions}
    </div>
  </div>`),
    QuestionContainerOpen: (questionNum) => (`<div id="generated-quiz-modal-question${questionNum}-container" style="z-index: 1;">`),
    QuestionContainerClose: `</div>`,
    QuestionSearchWeight:(questionNum) => (`<div class="d-flex flex-column align-items-center justify-content-center">
      <div class="star-rating-label">${getText('search-weight')}</div>
      <div id="question${questionNum}-weight-star-rating" class="mb-3"></div>
    </div>`),
    ModalFooter: () => `<div class="modal-footer justify-content-center" style="position: relative;">
  
  </div>
  <div class="btn-back justify-content-center"> 
    <button id="back-button" type="button" onclick="lastQuestion()"
    class="btn btn-quiz-answer btn-quiz-back">
    <span>back</span>
    </button>
  </div> 
  <div class="modal-footer justify-content-center">   
    <button id="continue-button" type="button" onclick="nextQuestion()"
    class="btn btn-quiz-answer btn-quiz-continue">
    <span>${getText('continue')}</span>
    </button>
  </div>`,
    ProgressBarOpen: `<div class="progress">`,
    ProgressBarCheckpoint: (questionNum, leftSideValue) => (`<div id="generated-quiz-modal-progress-bar-${questionNum}" class="progress-bar-checkpoint" style="left:${leftSideValue}%"><span></span></div>`),
    ProgressBarClose: (percentagePerQuestion) => (`<div id="generated-quiz-modal-progress-bar" class="progress-bar" role="progressbar" style="width: ${percentagePerQuestion}%;"><span></span></div></div>`),
    BasicAnswerButton: (question, answer, onclickFunctionName) => (`<button id="generated-quiz-modal-button_${question.unique_question_identifier}_${answer}" type="button" onclick="${onclickFunctionName}('${question.unique_question_identifier}','${answer}')"
    class="btn btn-quiz-answer">
    <span>${getText(`button-text-${question.unique_question_identifier}-${answer}`)}</span>
  </button>`),
    BasicQuestionTitle: (questionTitle) => (`<div class="d-flex flex-row mb-3 justify-content-center">
                                <h4>${questionTitle}</h4>
                            </div>`),
    NewButtonRowOpen: `<div class="d-flex flex-row mb-3 justify-content-center quiz-button-container">`,
    NewButtonRowClose: `</div>`,
    LoadingScreen: () => `
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
      <h4>${getText('loading-message')}</h4>
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>`,
    FirstPlaceStreamer: () => `
    <div class="container-fluid streamer-info-container winner">
    <div class="crown-container">
    <div class="crown">
    <img src="/images/crown.png">
    </div>


    </div>
        <div class="row">
            <div class="col">
                <div style="border-radius: 50%; border-color:#DAB9DF; border-width: 2px; height:130px; width:130px; margin-bottom: 24px; margin-top:25px; overflow: hidden; margin-left:auto; margin-right:auto;">
                    <img id="streamer-1-logo" style="max-width: 100%; max-height: 100%;" src="https://static-cdn.jtvnw.net/jtv_user_pictures/e0bbc79b-7c05-473b-a95c-508cd88c5991-profile_image-300x300.png" />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div>
                    <span class="streamer-username" id="streamer-1-user_name" >JinriTV</span>
                </div>
            </div>
        </div>
        <div class="row socials-container">
            <div class="col">
                <div >
                    <a id="streamer-1-ig_link">
                        <img style="max-width: 100%; max-height: 100%; padding-bottom: 12px;" src="/images/iglogo.png" />
                    </a>
                </div>
            </div>
            <div class="col">
            <div >
                <a id="streamer-1-twitch_link">
                    <img style="max-width: 100%; max-height: 100%; padding-bottom: 12px;" src="/images/twitchlogo.png" />
                </a>
            </div>
        </div>
        <div class="col">
        <div >
            <a id="streamer-1-twitter_link">
                <img style="max-width: 100%; max-height: 100%; padding-bottom: 12px;" src="/images/twitterlogo.png" />
            </a>
        </div>
    </div>
        </div>
        <div style="position: absolute; bottom: 0; margin-bottom:24px; left:0; right:0;">
  <span class="percent-match"><strong id="streamer-1-match">98</strong>%</span>
</div>
  </div>
 `,
    OtherStreamer: (streamerId) => (`
    <div class="container-fluid ">
        <div class="row">
            <div class="col">
                <div style="border-radius: 50%; border-color:#DAB9DF; border-width: 2px; height:126px; width:126px; margin-bottom: 24px; margin-top:25px; overflow: hidden; margin-left:auto; margin-right:auto;">
                <img id="streamer-${streamerId}-logo" style="max-width: 100%; max-height: 100%;" src="https://static-cdn.jtvnw.net/jtv_user_pictures/e0bbc79b-7c05-473b-a95c-508cd88c5991-profile_image-300x300.png" />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div>
                <span class="streamer-username" id="streamer-${streamerId}-user_name" >JinriTV</span>
                </div>
            </div>
        </div>
        <div class="row socials-container">
            <div class="col">
                <div >
                <a  id="streamer-${streamerId}-ig_link">
                        <img style="max-width: 100%; max-height: 100%; padding-bottom: 12px;" src="/images/iglogo.png" />
                    </a>
                </div>
            </div>
            <div class="col">
            <div >
            <a  id="streamer-${streamerId}-twitch_link">
                    <img style="max-width: 100%; max-height: 100%; padding-bottom: 12px;" src="/images/twitchlogo.png" />
                </a>
            </div>
        </div>
        <div class="col">
        <div >
        <a  id="streamer-${streamerId}-twitter_link">
                <img style="max-width: 100%; max-height: 100%; padding-bottom: 12px;" src="/images/twitterlogo.png" />
            </a>
        </div>
    </div>
        </div>
        <div class="row">
          <div class="col">
           
          </div>
        </div>
  </div>
  <div style="position: absolute; bottom: 0; margin-bottom:24px; left:0; right:0;">
    <span class="percent-match"><strong id="streamer-${streamerId}-match">98</strong>%</span>
  </div>`)
}