import React, { Component } from 'react'
import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/Home'
import Auth from './components/Auth'
import { Provider } from 'react-redux'
import store from './store'
import AuthHandler from './components/AuthHandler'
import Artist from './components/Artist/Artist'
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/:token" component={AuthHandler} />
            <Route exact path="/me/profile" component={Auth} />
            <Route exact path="/artist/:name/:mbid" component={Artist} />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
