import { useEffect } from 'react'

export default function Question(props) {
  useEffect(() => {
    console.log('answerSettings', props.answerSettings)
  }, [])

  function handleMultipleSelection(answer) {
    return (e) => {
      props.setCurrentAnswer(
        props.currentAnswer === null
          ? [answer]
          : [...props.currentAnswer, answer]
      )
    }
  }

  function handleSingleSelection(answer) {
    return () => {
      props.setCurrentAnswer(answer)
    }
  }

  function renderAnswers(type, answers) {
    switch (type) {
      case 'multipleselection':
        return answers.map((answer) => {
          return (
            <button
              type="button"
              key={answer}
              onClick={handleMultipleSelection(answer)}
              data-selected={props.currentAnswer?.includes(answer)}
            >
              {answer}
            </button>
          )
        })
      case 'singleselection':
        return answers.map((answer, index) => {
          if (props.id === 'mature') {
            const answerText = props.answerSettings[index]
              ? 'Mature'
              : 'Family-friendly'
            return (
              <button
                type="button"
                key={answer}
                onClick={handleSingleSelection(answerText)}
                data-selected={props.currentAnswer === answerText}
              >
                {answerText}
              </button>
            )
          }

          return (
            <button
              type="button"
              key={answer}
              onClick={handleSingleSelection(answer)}
              data-selected={props.currentAnswer === answer}
            >
              {answer}
            </button>
          )
        })
      case 'rangeslider':
        return <span>rangeslider</span>
      case 'timerange':
        return <span>timerange</span>
    }
  }

  return (
    <>
      <div className="quiz-question">
        {props.translation[`question-text-${props.id}`]}
      </div>
      <div className="quiz-answers" data-quiz-answers-type={props.type}>
        {renderAnswers(props.type, props.answerSettings)}
      </div>
    </>
  )
}
