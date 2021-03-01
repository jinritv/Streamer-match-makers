import { useEffect, useReducer, useState } from 'react'
import ProgressBar from './ProgressBar'
import Question from './Question'

export default function Quiz(props) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState(null)
  // answers - updates everytime "continue" is clicked
  const [answers, answersDispatch] = useReducer(reducer, {
    average_viewers: { min: 2500, max: 7500 },
    'chat-vibe': [],
    content: [],
    languages: [],
    mature: null,
    subonly: null,
    watchtime: {},
    ranks: {
      average_viewers: 3,
      'chat-vibe': 3,
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
    console.log('Quiz props', props)
  }, [props])

  useEffect(() => {
    console.log('answers', answers)
  }, [answers])

  useEffect(() => {
    console.log('currentAnswer', currentAnswer)
  }, [currentAnswer])

  const questionNumber = currentQuestion + 1
  const quizLength = props.quiz.Questions.length

  function nextQuestion() {
    if (currentQuestion + 1 === quizLength) {
      // submit quiz
      console.log('submit quiz')
      return
    }

    // update overall quiz answers state
    answersDispatch({ type: questionType, questionId, answer: currentAnswer })
    // reset answer
    setCurrentAnswer(null)
    // go to next question
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
        currentAnswer={currentAnswer}
        setCurrentAnswer={setCurrentAnswer}
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
          disabled={currentAnswer === null}
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
    case 'singleselection':
      return {
        ...state,
        [action.questionId]: action.answer,
      }
    default:
      throw new Error()
  }
}
