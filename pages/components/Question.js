import MultipleSelection from './Questions/MultipleSelection'

export default function Question(props) {
  function renderQuestion() {
    switch (props.type) {
      case 'multipleselection':
        return <MultipleSelection {...props} />
      case 'singleselection':
      case 'rangeslider':
      case 'timerange':
      default:
        return null
    }
  }
  return (
    <>
      <div className="quiz-question">
        {props.translation[`question-text-${props.id}`]}
      </div>
      <div className="quiz-answers" data-quiz-answers-type={props.type}>
        {renderQuestion()}
      </div>
    </>
  )
}
