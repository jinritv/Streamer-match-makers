export default function ProgressBar(props) {
  const segments = new Array(props.quizLength)
    .fill(null)
    .map((s, index) => index)

  return (
    <div className="quiz-progress-bar">
      {segments.map((i) => {
        const segmentClassName =
          props.currentQuestion >= i
            ? 'quiz-progress-bar-segment-complete'
            : 'quiz-progress-bar-segment'

        return <div key={i} className={segmentClassName} />
      })}
    </div>
  )
}
