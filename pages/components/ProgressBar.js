import { useEffect } from 'react'

export default function ProgressBar(props) {
  const segments = new Array(props.quizLength)
    .fill(null)
    .map((s, index) => index)

  useEffect(() => {
    console.log(props.currentQuestion)
  }, [props.currentQuestion])

  return (
    <div className="quiz-progress-bar">
      {segments.map((i) => {
        return (
          <span
            key={i}
            className={
              props.currentQuestion > i
                ? 'quiz-progress-bar-segment-complete'
                : 'quiz-progress-bar-segment'
            }
          />
        )
      })}
    </div>
  )
}
