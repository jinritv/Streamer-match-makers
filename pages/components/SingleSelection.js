import { useEffect } from 'react'

export default function SingleSelection(props) {
  useEffect(() => {
    console.log(props.completedAnswers[props.id])
  }, [props])

  return props.answerSettings.map((answer) => {
    // special case: for "mature" question
    let answerText = answer
    if (props.id === 'mature') {
      answerText = answer ? 'Mature' : 'Family-friendly'
    }

    return (
      <button
        type="button"
        key={answer}
        onClick={() => {
          props.updateAnswer(props.type, props.id, answer)
        }}
        data-selected={
          props.completedAnswers[props.id] === answer ? true : false
        }
      >
        {answerText}
      </button>
    )
  })
}
