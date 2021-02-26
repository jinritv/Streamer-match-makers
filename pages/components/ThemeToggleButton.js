import React from 'react'
import useTheme from '../hooks/useTheme'

export default function ThemeToggleButton() {
  const [theme, setTheme] = React.useState('light')
  useTheme(themes[theme])

  function toggleTheme() {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? '🌞' : '🌙'}
    </div>
  )
}

const themes = {
  light: {
    background: '#fff',
    color: '#000',
  },
  dark: {
    background: '#222',
    color: '#fff',
  },
}
