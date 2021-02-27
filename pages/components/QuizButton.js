import React from 'react'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import '@reach/dialog/styles.css'
import Quiz from './Quiz'

export default function QuizButton(props) {
  const [showQuiz, setShowQuiz] = React.useState(false)
  const open = () => setShowQuiz(true)
  const close = () => setShowQuiz(false)

  return (
    <>
      <button onClick={open}>Find a Streamer</button>
      <DialogOverlay isOpen={showQuiz} onDismiss={close}>
        <DialogContent aria-label="Streamer quiz">
          {/* <button className="quiz-close-button" onClick={close}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>X</span>
          </button> */}
          <Quiz quiz={props.quiz} translation={props.translation} />
        </DialogContent>
      </DialogOverlay>
    </>
  )
}
