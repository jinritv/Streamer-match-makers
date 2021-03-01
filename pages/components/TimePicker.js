import { useState } from 'react'

export default function TimePicker(props) {
  const [value, setValue] = useState(props.value)

  function handleChange(e) {
    const { type, name, value } = e.target
    setValue(value)
    props.onChange(type, name, value)
  }
  return (
    <>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        type="time"
        id={props.id}
        name={props.id}
        min="00:01"
        max="24:00"
        step="60"
        value={value} // must be in hh:mm format
        onChange={handleChange}
        disabled={props.disabled}
      ></input>
    </>
  )
}
