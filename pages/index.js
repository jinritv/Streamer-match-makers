import Header from './components/Header'
import Footer from './components/Footer'
import QuizButton from './components/QuizButton'
import { useEffect } from 'react'

export async function getStaticProps(context) {
  const res = await fetch(`http://localhost:3000/api/getQuizData`, {
    method: 'POST',
    body: JSON.stringify({ language: 'en-US' }),
  })

  const { Quiz, translation } = await res.json()

  return {
    props: {
      Quiz,
      translation,
    },
  }
}

export default function Index(props) {
  useEffect(() => {
    console.log(props)
  }, [props])

  return (
    <>
      <Header />
      <main className="page-main">
        <div className="billboard">
          <h2>
            Don't know who to <span>watch?</span>
          </h2>
          <h3>
            Twiri helps you discover new Twitch streamers who are just your
            type.
          </h3>
          <h2>2000+ matches made</h2>
          <QuizButton />
        </div>
      </main>
      <Footer />
    </>
  )
}
