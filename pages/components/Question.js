export default function Question(props) {
  function renderAnswers(type, answers) {
    switch (type) {
      case 'multipleselection':
        return answers.map((answer) => {
          return <span key={answer}>{answer}</span>
        })
      case 'singleselection':
        return <span>singleselection</span>
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
      <div className="quiz-answers">
        {renderAnswers(props.type, props.answers)}
      </div>
    </>
  )
}
