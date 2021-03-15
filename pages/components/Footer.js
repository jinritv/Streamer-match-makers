import ThemeToggleButton from './ThemeToggleButton'

export default function Footer() {
  return (
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
        <ThemeToggleButton />
      </div>
    </footer>
  )
}
