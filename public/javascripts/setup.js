// all the setup functions

// holds the references to the sliders so we can call
// functions on it
var SLIDERS = {};

// a timer for if the increment/decrement buttons are long-held,
// since we want to continue to increment/decrement when button is held
var pressTimer;

function setupElements() {
    QUIZ_QUESTIONS.forEach((question)=>{
      if(question.question_type == 'rangeslider'){
        setSliderDisplay(
          question.unique_question_identifier,
          question.answer_settings
        );
        setSliderEventHandlers(
          question.unique_question_identifier,
          question.answer_settings
        );
        $(`#generated-slider_${question.unique_question_identifier}`).on( "slide",
          (changeEvt) =>
            adjustSliderEventHandler(
              question.unique_question_identifier,
              question.answer_settings,
              changeEvt
            )
        );
      } 
      else if (question.question_type == 'timerange'){
        question.answer_settings.forEach((timeInput) => {
          $(`#generated-${question.unique_question_identifier}-${timeInput.value_name}`).hide();
      });
    }
    })
    InitializeTimePickers(captureTimeInputs);
    InitializeStarryRatings();
    setupStatsTooltipHover(); 
  }

  const adjustSliderEventHandler = (sliderName, settings, changeEvt) => {
    let minRange = changeEvt.value[0];
    let maxRange = changeEvt.value[1];
    let maxRangeDisplay = maxRange == settings.max ? `${maxRange}+` : maxRange;
    let displayText = getText(`range-display-${sliderName}`, [
      minRange,
      maxRangeDisplay,
    ]);
    $(`#generated-${sliderName}-slider-display`).html(displayText);
    UsersAnswers[sliderName] = {
      min: minRange,
      max: maxRange,
    };
  };
  
function setSliderEventHandlers(sliderName, settings) {
    // how many milliseconds to hold down the button before it starts incrementing
    const incrementDelay = 100;
  
    // we want to increment the value when holding the mouse button down,
    // and if we click, only increment by 1 unit
    $(`#generated-${sliderName}-minus`)
      .mouseup(function () {
        // Clear timeout
        clearInterval(pressTimer);
        return false;
      })
      .mousedown(function () {
        if (UsersAnswers[sliderName].min > settings.min) {
          SLIDERS[sliderName].slider(
            "setValue",
            [
              UsersAnswers[sliderName].min - settings.incrementBy,
              UsersAnswers[sliderName].max,
            ],
            true
          ); // must be true to call the 'slide' event
        }
        // Set interval
        pressTimer = window.setInterval(function () {
          if (UsersAnswers[sliderName].min > settings.min) {
            SLIDERS[sliderName].slider(
              "setValue",
              [
                UsersAnswers[sliderName].min - settings.incrementBy,
                UsersAnswers[sliderName].max,
              ],
              true
            ); // must be true to call the 'slide' event
          }
        }, incrementDelay);
        return false;
      });
    $(`#generated-${sliderName}-plus`)
      .mouseup(function () {
        clearInterval(pressTimer);
        return false;
      })
      .mousedown(function () {
        if (UsersAnswers[sliderName].max < settings.max) {
          SLIDERS[sliderName].slider(
            "setValue",
            [
              UsersAnswers[sliderName].min,
              UsersAnswers[sliderName].max + settings.incrementBy,
            ],
            true
          ); // must be true to call the 'slide' event
        }
        // Set interval
        pressTimer = window.setInterval(function () {
          if (UsersAnswers[sliderName].max < settings.max) {
            SLIDERS[sliderName].slider(
              "setValue",
              [
                UsersAnswers[sliderName].min,
                UsersAnswers[sliderName].max + settings.incrementBy,
              ],
              true
            ); // must be true to call the 'slide' event
          }
        }, 100);
        return false;
      });
  }
  
  
function setSliderDisplay(sliderName, settings) {
    let minRange = settings.min;
    let maxRange = settings.max;
    let minDefault = settings.defaultMin;
    let maxDefault = settings.defaultMax;
    let displayText = getText(`range-display-${sliderName}`, [
      minDefault,
      maxDefault,
    ]);
    $(`#generated-${sliderName}-slider-display`).html(displayText);
    SLIDERS[sliderName] = $(`#generated-slider_${sliderName}`).slider({
      id: `generated-slider_${sliderName}`,
      min: minRange,
      max: maxRange,
      range: true,
      value: [minDefault, maxDefault],
      tooltip: "hide",
    });
    UsersAnswers[sliderName] = {
      min: minDefault,
      max: maxDefault,
    };
  }

function InitializeTimePickers(onClose) {
    $(".time").clockTimePicker({
      onClose: function () {
        onClose();
      },
      alwaysSelectHoursFirst: true,
      required: true,
      // custom colors
      colors: {
        buttonTextColor: "#bf7dd3",
        clockFaceColor: "#EEEEEE",
        clockInnerCircleTextColor: "#888888",
        clockInnerCircleUnselectableTextColor: "#CCCCCC",
        clockOuterCircleTextColor: "#000000",
        clockOuterCircleUnselectableTextColor: "#CCCCCC",
        hoverCircleColor: "#DDDDDD",
        popupBackgroundColor: "#FFFFFF",
        popupHeaderBackgroundColor: "#0797FF",
        popupHeaderTextColor: "#FFFFFF",
        selectorColor: "#DAB9DF",
        selectorNumberColor: "#FFFFFF",
        signButtonColor: "#FFFFFF",
        signButtonBackgroundColor: "#0797FF",
      },
    });
  }

  function InitializeStarryRatings() {
    UsersAnswers["ranks"] = {};
  
    for (var i = 0; i < QUIZ_QUESTIONS.length; ++i) {
      let question = QUIZ_QUESTIONS[i];
  
      // default rank
      UsersAnswers["ranks"][question.unique_question_identifier] = 3;
  
      let starRatingId = `question${i + 1}-weight-star-rating`;
      let starRatingEl = document.getElementById(starRatingId);
  
      if (starRatingEl) {
        new Starry(starRatingEl, {
          name: starRatingId,
          beginWith: 60, // 3 out of 5 stars
          multiple: true,
          onRate: function (rating) {
            UsersAnswers["ranks"][question.unique_question_identifier] =
              parseInt(rating) || 3;
          },
        });
      }
    }
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
          return "";
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
        return tooltip;
      },
    });
  }
  
  function statsTooltipColor(v) {
    if (v >= 70) {
      return "#1df51d";
    } else if (v < 30) {
      return "#f52525";
    }
    return "white";
  }

