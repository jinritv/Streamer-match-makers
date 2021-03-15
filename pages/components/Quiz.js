import { useEffect, useReducer, useState } from 'react'
import ProgressBar from './ProgressBar'
import Question from './Question'

export default function Quiz(props) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, answersDispatch] = useReducer(reducer, {
    average_viewers: { min: 2500, max: 7500 },
    chat_vibe: [],
    content: [],
    languages: [],
    mature: null,
    subonly: null,
    watchtime: {
      userOffsetMinute: new Date().getTimezoneOffset() * -1,
      weekdays: false,
      weekdaysFrom: '09:30',
      weekdaysTo: '17:40',
      weekends: false,
      weekendsFrom: '09:30',
      weekendsTo: '17:40',
    },
    ranks: {
      average_viewers: 3,
      chat_vibe: 3,
      content: 3,
      languages: 3,
      mature: 3,
      subonly: 3,
      watchtime: 3,
    },
  })

  const {
    answer_settings: answerSettings,
    // buttonsPerRow,
    // disableContinueButtonByDefault,
    // onclickFunctionName,
    unique_question_identifier: questionId,
    question_type: questionType,
  } = props.quiz.Questions[currentQuestion]

  useEffect(() => {
    console.log('answers', answers)
  }, [answers])

  useEffect(() => {
    console.log('props.quiz.Questions', props.quiz.Questions)
  }, [props.quiz.Questions])

  const questionNumber = currentQuestion + 1
  const quizLength = props.quiz.Questions.length

  function updateAnswer(type = questionType, id = questionId, answer) {
    answersDispatch({ type, id, answer })
  }

  function nextQuestion() {
    if (currentQuestion + 1 === quizLength) {
      // submit quiz

      submitQuiz(answers)
      return
    }

    setCurrentQuestion(currentQuestion + 1)
  }

  function prevQuestion() {
    if (currentQuestion === 0) {
      // close quiz
      props.closeQuiz()
      return
    }
    setCurrentQuestion(currentQuestion - 1)
  }

  function submitQuiz(answers) {
    console.log('submitting quiz...', answers)

    // Temp code while backend is changed
    alert('Submitting quiz...')

    props.closeQuiz()

    // fetch('/api/calculateStreamer', {
    //   method: 'POST',
    //   body: JSON.stringify(answers),
    // })
    //   .then((res) => {
    //     return res.json()
    //   })
    //   .then((data) => {
    //     console.log('/api/calculateStreamer', data)
    //   })
  }

  return (
    <>
      <div className="quiz-question-counter">
        Question {questionNumber} of {quizLength}
      </div>
      <ProgressBar quizLength={quizLength} currentQuestion={currentQuestion} />
      <Question
        key={questionId}
        id={questionId}
        type={questionType}
        answerSettings={answerSettings}
        updateAnswer={updateAnswer}
        completedAnswers={answers}
        translation={props.translation}
      />
      <div className="quiz-nav-buttons">
        <button
          type="button"
          className="quiz-nav-button-back"
          onClick={prevQuestion}
        >
          Back
        </button>
        <button
          type="button"
          className="quiz-nav-button-continue"
          onClick={nextQuestion}
          disabled={
            answers[questionId] === null ||
            (Array.isArray(answers[questionId]) && !answers[questionId].length)
          }
        >
          Continue
        </button>
      </div>
    </>
  )
}

function reducer(state, action) {
  /**
   *  Action types = answer types?
   *
   *  multipleselection
   *  singleselection
   *  rangeslider
   *  timerange
   *
   */
  switch (action.type) {
    case 'multipleselection':
      // handle error in case of question id not existing
      if (!state[action.id]) {
        //
      }

      //
      if (state[action.id]?.includes(action.answer)) {
        return {
          ...state,
          [action.id]: state[action.id].filter(
            (item) => item !== action.answer
          ),
        }
      }

      return {
        ...state,
        [action.id]: [...new Set([...state[action.id], action.answer])],
      }
    case 'singleselection':
      return {
        ...state,
        [action.id]: action.answer,
      }
    case 'rangeslider':
      return {
        ...state,
        [action.id]: action.answer,
      }
    case 'timerange':
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.answer,
        },
      }
    default:
      throw new Error()
  }
}
