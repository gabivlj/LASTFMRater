import React from 'react'
import KEYS from '../../API'
import logo from '../../logo.png'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p style={{ color: '#ff0000' }}>
          Rate the music that you listen on Last.fm! Make reviews and check what
          others rating of your favorite artist!
        </p>
        <Link
          className="App-link"
          to="/auth/login"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#b0131e' }}
        >
          Log into your profile
        </Link>
        <Link
          className="App-link"
          to="/auth/register"
          target="_blank"
          style={{ color: '#b0131e' }}
        >
          Register!
        </Link>
      </header>
    </div>
  )
}
