import TimePicker from './TimePicker'

export default function Watchtime(props) {
  const [weekday, weekend] = props.answerSettings

  return (
    <>
      <div className="quiz-time-range">
        <div className="quiz-checkbox">
          <input
            type="checkbox"
            id="weekdays"
            name="weekdays"
            checked={props.completedAnswers[props.id]?.weekdays ? true : false}
            onChange={(e) => {
              const { type, name, checked } = e.target
              props.onTimeChange(type, name, checked)
            }}
          />
          <label htmlFor="weekdays">Weekdays</label>
        </div>
        <TimePicker
          id="quiz-time-weekday-from"
          name="weekdaysFrom"
          label="from"
          value={`0${weekday.minDefault}`}
          onChange={props.onTimeChange}
          disabled={!props.completedAnswers[props.id]?.weekdays}
        />
        <TimePicker
          id="quiz-time-weekday-to"
          name="weekdaysTo"
          label="to"
          value={weekday.maxDefault}
          onChange={props.onTimeChange}
          disabled={!props.completedAnswers[props.id]?.weekdays}
        />
      </div>
      <div className="quiz-time-range">
        <div className="quiz-checkbox">
          <input
            type="checkbox"
            id="weekends"
            name="weekends"
            checked={props.completedAnswers[props.id]?.weekends ? true : false}
            onChange={(e) => {
              const { type, name, checked } = e.target
              props.onTimeChange(type, name, checked)
            }}
          />
          <label htmlFor="weekends">Weekends</label>
        </div>
        <TimePicker
          id="quiz-time-weekend-from"
          name="weekendsFrom"
          label="from"
          value={`0${weekend.minDefault}`}
          onChange={props.onTimeChange}
          disabled={!props.completedAnswers[props.id]?.weekends}
        />
        <TimePicker
          id="quiz-time-weekend-to"
          name="weekendsTo"
          label="to"
          value={weekend.maxDefault}
          onChange={props.onTimeChange}
          disabled={!props.completedAnswers[props.id]?.weekends}
        />
      </div>
    </>
  )
}
