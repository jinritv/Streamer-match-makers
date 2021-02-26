import Header from './components/Header'
import Footer from './components/Footer'
import QuizButton from './components/QuizButton'

export default function Index() {
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
