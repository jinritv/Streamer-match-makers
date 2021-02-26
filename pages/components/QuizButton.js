import React from 'react'
import { Dialog /*, DialogOverlay, DialogContent */ } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import '@reach/dialog/styles.css'
import Quiz from './Quiz'

export default function QuizButton() {
  const [showQuiz, setShowQuiz] = React.useState(false)
  const open = () => setShowQuiz(true)
  const close = () => setShowQuiz(false)

  return (
    <>
      <button onClick={open}>Find a Streamer</button>
      <Dialog isOpen={showQuiz} onDismiss={close} aria-label="Streamer quiz">
        <button className="close-button" onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        <Quiz />
      </Dialog>
    </>
  )
}
