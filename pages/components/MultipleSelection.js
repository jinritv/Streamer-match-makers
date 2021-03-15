import { useEffect } from 'react'

export default function MultipleSelection(props) {
  useEffect(() => {
    console.log(props.completedAnswers[props.id])
  }, [props])

  return props.answerSettings.map((answer) => {
    return (
      <button
        type="button"
        key={answer}
        onClick={() => {
          props.updateAnswer(props.type, props.id, answer)
        }}
        data-selected={
          props.completedAnswers[props.id]?.includes(answer) ? true : false
        }
      >
        {answer}
      </button>
    )
  })
}
