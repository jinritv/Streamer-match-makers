function Home() {
  return (
    <>
      <header className="page-header">
        <img src="/images/logo.svg" />
        <h1>Twiri, Stream Seeker</h1>
      </header>
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
          <button type="button" onClick={toggleQuizModal}>
            Find a Streamer
          </button>
        </div>
      </main>
      <footer className="page-footer">
        <nav>
          <ul>
            <li>About</li>
            <li>Submit Your Stream</li>
            <li>Contribute</li>
          </ul>
        </nav>
        <div className="page-footer-utility">
          <div className="copyright">Copyright &copy; 2020</div>
          <div className="theme-toggle">☀️</div>
        </div>
      </footer>
    </>
  )
}

export default Home
