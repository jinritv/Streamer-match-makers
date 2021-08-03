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
};

// Specific settings for each type of question
const QuestionTypeSettings = {
  [QuestionTypes.Buttons.MultipleSelection]: {
    buttonsPerRow: 4, // buttons to put on a single row before making a new row
    onclickFunctionName: "selectMultipleButton", // name of the function to run in the onclick handler
  },
  [QuestionTypes.Buttons.SingleSelection]: {
    buttonsPerRow: 1,
    onclickFunctionName: "selectButton",
  },
  [QuestionTypes.RangeSlider]: {
    // no default settings for this type of question
  },
  [QuestionTypes.TimeRange]: {
    // no default settings for this type of question
  },
};

// the quiz's questions will be built and displayed in the order they appear in this array
const QuizQuestions = [
  // Question 1: 'languages'
  {
    unique_question_identifier: "languages", //unique name for this question
    question_type: QuestionTypes.Buttons.MultipleSelection, // type of question as explained above
    disableContinueButtonByDefault: true, // should the 'Continue' button get disabled when the question is displayed (is the it instantly skippable?)
    buttonsPerRow: 3, // if you include this property, you override the default buttons per row
    onclickFunctionName: "exampleOnClickFunction", // you can override the function that is called when the button is pressed
    answer_settings: [
      // list values for the answers here
      "english",
      "korean",
      "japanese",
      "mandarin",
      "french",
      "spanish",
      "thai",
      "russian",
      "vietnamese",
      "german",
      "tagalog",
      "cantonese",
      "portuguese",
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
      "sciencetech",
      "music",
      "art",
      "food",
      "talk",
      "maker",
      "travel",
      "asmr",
      "fitness",
      "events",
      "sports",
      "politics",
      "quiz",
      "crypto",
      "stock",
      "casino",
      "board",
      "bodyart",
      "tarot",
      "makeup",
      "sleep",
      "twitch",

    ],
  },

  //Question 3: Follower/Sub only chat?
  {
    unique_question_identifier: "subonly",
    question_type: QuestionTypes.Buttons.SingleSelection,
    disableContinueButtonByDefault: true,
    answer_settings: ["all", "sub-only", "follower-only"],
  },

  //Question 4: Mature
  {
    unique_question_identifier: "mature",
    question_type: QuestionTypes.Buttons.SingleSelection,
    disableContinueButtonByDefault: true,
    answer_settings: [true, false],
  },

  // Question 5: chat vibes
  {
    unique_question_identifier: "chat_vibe",
    question_type: QuestionTypes.Buttons.MultipleSelection,
    disableContinueButtonByDefault: true,
    buttonsPerRow: 4,
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
      "toxic",
    ],
  },

  // Question 6: average_viewers
  {
    unique_question_identifier: "average_viewers",
    question_type: QuestionTypes.RangeSlider,
    disableContinueButtonByDefault: false,
    answer_settings: {
      min: 0,
      max: 2000,
      incrementBy: 50,
      defaultMin: 200,
      defaultMax: 1000,
    },
  },

  // Question 7: 'gender'
  {
    unique_question_identifier: "gender",
    question_type: QuestionTypes.Buttons.SingleSelection,
    disableContinueButtonByDefault: true,
    answer_settings: ["male", "female", "nopreference"],
  },
];

module.exports = {
  Quiz: {
    Types: QuestionTypes,
    Questions: QuizQuestions,
    Settings: QuestionTypeSettings,
  },
};
