import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LinearProgress } from '@material-ui/core';
import { setUser, getUser } from '../../actions/authActions';
import { getPlaylists } from '../../actions/profileActions';
import ArtistsUser from './ArtistsUser';
import Ratings from '../Profile/Ratings/Ratings';
import PlaylistShowcase from '../Profile/Playlist/PlaylistShowcase';

const __propTypes = { // 
  setUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

class Auth extends Component {
  static propTypes = __propTypes;

  constructor(props) {
    super(props);
    this.state = {
      user: { empty: true },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.state.user.empty &&
      nextProps.auth.currentUser &&
      Object.keys(nextProps.auth.currentUser)
    ) {
      this.setState({
        user: nextProps.auth.apiUser,
      });
    }
  }

  componentDidMount() {
    if (
      this.props.auth.apiUser &&
      Object.keys(this.props.auth.apiUser).length > 0 &&
      this.state.user.empty
    ) {
      this.setState({
        user: this.props.auth.apiUser,
      });
    }
  }

  componentWillMount() {
    const { auth, apiUser} = this.props.auth;
    if (auth) {
      this.props.getUser();
      this.props.getPlaylists(apiUser.user);
    }
  }

  render() {
    const { user } = this.state;
    const { profile } = this.props;
    if (!user) {
    }
    return (
      <div>
        {!user.empty ? (
          <h1 className="container">Welcome to LastRater, {user.user}! </h1>
        ) : (
          <LinearProgress />
        )}
        <div className="pb-3 mt-3">
          <div className="row">
            <div className="col-md-6 playlistsZone mb-3 mt-3 container">
            { profile.isLoadingPlaylists ? ( 
              <div className="mt-3"><LinearProgress /></div>
            ) : ( 
              <PlaylistShowcase 
                playlists={profile.playlists} 
              />)}   
            </div>
            <div className="col-md-6">
              <h2 className="mt-3 mb-3">
              Your ratings!
              </h2>
              <Ratings /> 
            </div>
          </div>                    
        </div>
             
        {!user.lastfm || user.lastfm.trim() === '' ? (
          <h2>
            Pair your current Lastfm account with this account to get all the
            advantages!
          </h2>
        ) : (
          <ArtistsUser history={this.props.history} />
        )}        
      </div>
    );
  }
}

const mapStateToProps = state => ({ auth: state.auth, profile: state.profile });

export default connect(
  mapStateToProps,
  { setUser, getUser, getPlaylists }
)(Auth);
