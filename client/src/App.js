import React, { Component } from 'react'
import './App.css'
// TODO: Add private routes as well. Also, we must check if we can make authentification without Lastfm API.
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Auth from './components/Auth'
import { Provider } from 'react-redux'
import store from './store'
import AuthHandler from './components/AuthHandler'
import Artist from './components/Artist/Artist'
import Album from './components/Album/Album'
import { setFullUserFromSession } from './actions/authActions'
import AppBarMine from './components/Search/AppBarMine'
import SearchRoute from './components/Search/SearchRoute/SearchRoute'

// Get user from localStorage.
store.dispatch(setFullUserFromSession())

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <div>
              <Switch>
                <Route exact path="/" component={Home} />

                <Route exact path="/:token" component={AuthHandler} />
                <Route exact path="/me/profile" component={Auth} />
                <Route exact path="/artist/:name" component={Artist} />
                <Route
                  exact
                  path="/album/:artist/:albumname/:mbid"
                  component={Album}
                />
                <Route
                  exact
                  path="/search/:searchquery"
                  component={SearchRoute}
                />
                {/* Create a Not found page... */}
                <Route path="*" component={Home} />
              </Switch>
            </div>
            <AppBarMine />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
