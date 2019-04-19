import React from 'react'
import KEYS from '../../API'
const LastfmAuth = () => {
  
  return (
    <div className="container mt-3">
      <h2>
        Wanna connect your Lastfm account with your LastRater account? Press
        here!
      </h2>
      <a
        className="App-link"
        href={`http://www.last.fm/api/auth/?api_key=${KEYS.API_KEY}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#b0131e' }}
      >
        Log into your profile
      </a>
    </div>
  )
}

export default LastfmAuth
