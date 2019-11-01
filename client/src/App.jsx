import React, { Component } from 'react';
import './App.css';
// TODO: Add private routes as well. Also, we must check if we can make authentification without Lastfm API.
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
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
import Playlist from './components/Playlist/PlaylistPage/Playlist';
import Socket from './components/Chat/Socket';
import Profile from './components/Profile/Profile/Profile';
import Notify from './components/Notifications/Notify';
import Chat from './components/Chat/Chat/Chat';
import ChatDialog from './components/Chat/Chat/ChatDialog';
import CommentDialog from './components/Comment/CommentDialog';
import ReviewEditor from './components/Review/ReviewEditor';
import Test from './components/Test/Test';
import { StyleJSX } from './styles/StyleIt';
import theme from './css/theme';
import css from './css';
import ArtistForm from './components/Artist/Form/ArtistForm';
import Suggestions from './components/Suggestion/Suggestions';

store.dispatch(logFromSession());

function App() {
  return (
    <Provider store={store}>
      <Router>
        <StyleJSX theme={theme} style={css}>
          <div>
            <div>
              {/* Create a Not found page... */}
              <Socket />
              <Switch>
                <Route exact path="/" component={Home} />
                {/* Change this route */}
                <Route exact path="/:token" component={AuthHandler} />
                <Route
                  exact
                  path="/test/you/shouldnt/be/here"
                  component={Test}
                />
                <Route exact path="/artist/:name/:_id" component={Artist} />
                <Route
                  exact
                  path="/album/:artist/:albumname/:mbid"
                  component={Album}
                />
                <Route
                  exact
                  path="/suggestion/:type/:id"
                  component={Suggestions}
                />
                <Route
                  exact
                  path="/search/:searchquery"
                  component={SearchRoute}
                />
                <Route exact path="/auth/login" component={Login} />
                <Route exact path="/auth/register" component={Register} />
                <Route exact path="/profile/:id" component={Profile} />
                <PrivateRoute
                  exact
                  path="/artist-edit/form/:id"
                  component={ArtistForm}
                />
                <PrivateRoute
                  exact
                  path="/review/edit/:id"
                  component={ReviewEditor}
                />
                <PrivateRoute exact path="/me/profile" component={Auth} />
                <PrivateRoute
                  exact
                  path="/playlist/create"
                  component={PlaylistFormComponent}
                />
                <PrivateRoute exact path="/chat/:id" component={Chat} />
                <PrivateRoute
                  exact
                  path="/playlist/view/:id"
                  component={Playlist}
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
            <ChatDialog />
            <CommentDialog />
            <Notify />
            <AppBarMine />
          </div>
        </StyleJSX>
      </Router>
    </Provider>
  );
}

export default App;
