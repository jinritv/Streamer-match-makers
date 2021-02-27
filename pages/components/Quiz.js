import { useState } from 'react'
import ProgressBar from './ProgressBar'
import Question from './Question'

export default function Quiz(props) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const questionNumber = currentQuestion + 1
  const quizLength = props.quiz.Questions.length

  function nextQuestion() {
    if (currentQuestion + 1 === quizLength) {
      // submit quiz
      console.log('submit quiz')
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

  const {
    answer_settings: answers,
    // buttonsPerRow,
    // disableContinueButtonByDefault,
    // onclickFunctionName,
    unique_question_identifier: id,
    question_type: type,
  } = props.quiz.Questions[currentQuestion]

  return (
    <>
      <div className="quiz-question-counter">
        Question {questionNumber} of {quizLength}
      </div>
      <ProgressBar quizLength={quizLength} currentQuestion={currentQuestion} />
      <Question
        key={id}
        id={id}
        type={type}
        answers={answers}
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
        >
          Continue
        </button>
      </div>
    </>
  )
}
