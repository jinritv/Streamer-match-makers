import { useState } from 'react'

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
      console.log('close quiz')
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
    <div>
      <Question
        key={id}
        id={id}
        type={type}
        quizLength={quizLength}
        questionNumber={questionNumber}
        answers={answers}
        translation={props.translation}
      />
      <button type="button" onClick={prevQuestion}>
        ← Back
      </button>
      <button type="button" onClick={nextQuestion}>
        Continue →
      </button>
    </div>
  )
}

function Question(props) {
  function renderAnswers(type, answers) {
    switch (type) {
      case 'multipleselection':
        return answers.map((answer) => {
          return <div key={answer}>{answer}</div>
        })
      case 'singleselection':
        return <div>singleselection</div>
      case 'rangeslider':
        return <div>rangeslider</div>
      case 'timerange':
        return <div>timerange</div>
    }
  }

  return (
    <div>
      <div>
        Question {props.questionNumber} of {props.quizLength}
      </div>
      <div>{props.translation[`question-text-${props.id}`]}</div>
      <div>{renderAnswers(props.type, props.answers)}</div>
    </div>
  )
}
