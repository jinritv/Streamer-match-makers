import MultipleSelection from './MultipleSelection'
import RangeSlider from './RangeSlider'
import SingleSelection from './SingleSelection'
import Watchtime from './Watchtime'

export default function Question(props) {
  function handleRangeSliderChange(values) {
    const [min, max] = values
    props.updateAnswer(props.type, props.id, { min, max })
  }

  function handleTimeRangeChange(type, name, value) {
    let currentAnswer = props.completedAnswers[props.id] ?? {}

    if (type === 'checkbox') {
      props.updateAnswer(props.type, props.id, {
        ...currentAnswer,
        [name]: value,
      })
      return
    }

    if (type === 'time') {
      props.updateAnswer(props.type, props.id, {
        ...currentAnswer,
        [name]: value,
      })
      return
    }
  }

  function renderQuestion() {
    switch (props.type) {
      case 'multipleselection':
        return <MultipleSelection {...props} />
      case 'singleselection':
        return <SingleSelection {...props} />
      case 'rangeslider':
        const { defaultMin, defaultMax, min, max } = props.answerSettings
        let defaultMinText = props.completedAnswers[props.id]?.min ?? defaultMin
        let defaultMaxText = props.completedAnswers[props.id]?.max ?? defaultMax
        let rangeText = `Between ${defaultMinText} and ${defaultMaxText} `

        if (props.id === 'average_viewers') {
          rangeText += 'viewers'
        }

        return (
          <>
            <p className="quiz-range-title">{rangeText}</p>
            <RangeSlider
              defaultMin={defaultMin}
              defaultMax={defaultMax}
              min={min}
              max={max}
              onValueChange={handleRangeSliderChange}
            />
          </>
        )
      case 'timerange':
        return <Watchtime {...props} onTimeChange={handleTimeRangeChange} />
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
