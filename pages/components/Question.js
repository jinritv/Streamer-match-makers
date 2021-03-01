import { useEffect } from 'react'
import RangeSlider from './RangeSlider'
import TimePicker from './TimePicker'

export default function Question(props) {
  // useEffect(() => {
  //   console.log('answerSettings', props.answerSettings)
  // }, [])

  // useEffect(() => {
  //   setCurrentAnswer()
  // }, [])

  function handleMultipleSelection(answer) {
    return () => {
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

  function handleTimeRangeChange(type, name, value) {
    let currentAnswer = props.currentAnswer ?? {}

    if (type === 'checkbox') {
      props.setCurrentAnswer({
        ...currentAnswer,
        [name]: value,
      })
      return
    }

    if (type === 'time') {
      props.setCurrentAnswer({
        ...currentAnswer,
        [name]: value,
      })
      return
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
        const [weekday, weekend] = props.answerSettings

        return (
          <>
            <div className="quiz-time-range">
              <div className="quiz-checkbox">
                <input
                  type="checkbox"
                  id="weekdays"
                  name="weekdays"
                  checked={props.currentAnswer?.weekdays ? true : false}
                  onChange={(e) => {
                    const { type, name, checked } = e.target
                    handleTimeRangeChange(type, name, checked)
                  }}
                />
                <label htmlFor="weekdays">Weekdays</label>
              </div>
              <TimePicker
                id="quiz-time-weekday-from"
                name="weekdaysFrom"
                label="from"
                value={`0${weekday.minDefault}`}
                onChange={handleTimeRangeChange}
                disabled={!props.currentAnswer?.weekdays}
              />
              <TimePicker
                id="quiz-time-weekday-to"
                name="weekdaysTo"
                label="to"
                value={weekday.maxDefault}
                onChange={handleTimeRangeChange}
                disabled={!props.currentAnswer?.weekdays}
              />
            </div>
            <div className="quiz-time-range">
              <div className="quiz-checkbox">
                <input
                  type="checkbox"
                  id="weekends"
                  name="weekends"
                  checked={props.currentAnswer?.weekends ? true : false}
                  onChange={(e) => {
                    const { type, name, checked } = e.target
                    handleTimeRangeChange(type, name, checked)
                  }}
                />
                <label htmlFor="weekends">Weekends</label>
              </div>
              <TimePicker
                id="quiz-time-weekend-from"
                name="weekendsFrom"
                label="from"
                value={`0${weekend.minDefault}`}
                onChange={handleTimeRangeChange}
                disabled={!props.currentAnswer?.weekends}
              />
              <TimePicker
                id="quiz-time-weekend-to"
                name="weekendsTo"
                label="to"
                value={weekend.maxDefault}
                onChange={handleTimeRangeChange}
                disabled={!props.currentAnswer?.weekends}
              />
            </div>
          </>
        )
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
