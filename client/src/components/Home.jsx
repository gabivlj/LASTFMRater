import React from 'react'
import KEYS from '../API'
import logo from '../logo.png'
export default function Home() {
  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p style={{ color: '#ff0000' }}>
          Rate the music that you listen on Last.fm! Make reviews and check what
          others rating of your favorite artist!
        </p>
        <a
          className="App-link"
          href={`http://www.last.fm/api/auth/?api_key=${KEYS.API_KEY}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#b0131e' }}
        >
          Log into your profile
        </a>
      </header>
    </div>
  )
}
