import { useEffect } from 'react'
import RangeSlider from './RangeSlider'

export default function Question(props) {
  // useEffect(() => {
  //   console.log('answerSettings', props.answerSettings)
  // }, [])

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

  function handleRangeSliderChange(values) {
    const [min, max] = values
    props.setCurrentAnswer({ min, max })
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

            const answerValue = answerText === 'Mature' ? true : false

            return (
              <button
                type="button"
                key={answer}
                onClick={handleSingleSelection(answerValue)}
                data-selected={props.currentAnswer === answerValue}
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
        const { defaultMin, defaultMax, min, max } = props.answerSettings
        let defaultMinText = props.currentAnswer?.min ?? defaultMin
        let defaultMaxText = props.currentAnswer?.max ?? defaultMax
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
