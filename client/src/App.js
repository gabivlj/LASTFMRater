import React, { Component } from 'react';
import './App.css';
// TODO: Add private routes as well. Also, we must check if we can make authentification without Lastfm API.
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import Home from './components/Home/Home';
import Auth from './components/AuthLastfm/Auth';
import store from './store';
import AuthHandler from './components/AuthLastfm/AuthHandler';
import Artist from './components/Artist/Artist';
import Album from './components/Album/Album';
import { setFullUserFromSession, logFromSession } from './actions/authActions';
import AppBarMine from './components/Search/AppBarMine';
import SearchRoute from './components/Search/SearchRoute/SearchRoute';
import NotFound from './components/not-found/NotFound';
import PrivateRoute from './components/Common/PrivateRoute';
import PlaylistFormComponent from './components/Playlist/PlaylistForm/PlaylistForm.component';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import LastfmAuth from './components/LastfmAuth/LastfmAuth';
import Configuration from './components/Configuration/Configuration';
// Get user from localStorage.
store.dispatch(logFromSession());

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <div>
              {/* Create a Not found page... */}

              <Switch>
                <Route exact path="/" component={Home} />
                {/* Change this route */}
                <Route exact path="/:token" component={AuthHandler} />

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
                <Route exact path="/auth/login" component={Login} />
                <Route exact path="/auth/register" component={Register} />
                <PrivateRoute exact path="/me/profile" component={Auth} />
                <PrivateRoute
                  exact
                  path="/playlist/create"
                  component={PlaylistFormComponent}
                />
                <PrivateRoute
                  exact
                  path="/me/configuration"
                  component={Configuration}
                />
                <PrivateRoute
                  exact
                  path="/lastfm/connect"
                  component={LastfmAuth}
                />
                 <Route render={() => <Redirect to="/sorry/not-found" />} />
              </Switch>
             
              <Route component={NotFound} exact path="/sorry/not-found" />
            </div>
            <AppBarMine />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
