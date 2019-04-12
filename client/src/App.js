import React, { Component } from 'react'
import './App.css'
// TODO: Add private routes as well. Also, we must check if we can make authentification without Lastfm API.
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/Home/Home'
import Auth from './components/Auth/Auth'
import { Provider } from 'react-redux'
import store from './store'
import AuthHandler from './components/Auth/AuthHandler'
import Artist from './components/Artist/Artist'
import Album from './components/Album/Album'
import { setFullUserFromSession } from './actions/authActions'
import AppBarMine from './components/Search/AppBarMine'
import SearchRoute from './components/Search/SearchRoute/SearchRoute'
import NotFound from './components/not-found/NotFound'
import PrivateRoute from './components/Common/PrivateRoute'
import PlaylistFormComponent from './components/Playlist/PlaylistForm/PlaylistForm.component'
// Get user from localStorage.
store.dispatch(setFullUserFromSession())

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <div>
              {/* Create a Not found page... */}
              <Route exact path="/" component={Home} />
              {/* Change this route */}
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

              <Switch>
                <PrivateRoute
                  exact
                  path="/playlist/create"
                  component={PlaylistFormComponent}
                />
              </Switch>
              <Route component={NotFound} />
            </div>
            <AppBarMine />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
