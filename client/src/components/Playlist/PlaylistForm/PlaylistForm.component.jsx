import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GeneralForm from './visuals/GeneralForm';
import CurrentTracks from './Track/current/CurrentTracks';
import TrackSearchComponent from './Track/TrackSearch.component';
import { removeTrack, sendPlaylist } from '../../../actions/playlistActions';
import { withRouter } from 'react-router-dom'
import { LinearProgress } from '@material-ui/core';

const propTypes_ = {
  auth: PropTypes.object.isRequired,
  playlist: PropTypes.object.isRequired,
  sendPlaylist: PropTypes.func.isRequired,
  removeTrack: PropTypes.func.isRequired,
};

class PlaylistFormComponent extends Component {
  constructor() {
    super();
    this.state = {
      tracks: [], // pass it to visuals/TrackList.jsx
      name: '', // pass it to visuals/FormInfo
      description: '', // pass it to visuals/FormInfo
      user: null, // api purposes
      img: '', // pass it to visuals/FormInfo (playlistCover)
    };
  }

  // React.lifecycles
  componentDidMount() {
    if (!this.props.auth.apiUser && !this.props.auth.auth) {
      // TODO PUSH NOTIFICATION TO INFORM THAT HE HAS BEEN REDIRECTED !
      // this.props.history.push('/')
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { auth, history, playlist, sendPlaylist } = this.props;
    const { name, description, img } = this.state;
    sendPlaylist(
      auth.apiUser.user,
      name,
      description,
      img,
      history,
      playlist.addedTracks
    );
  }

  componentWillUpdate(nextProps) {    
    if (nextProps.auth.apiUser && !this.state.user) {
      this.setState({
        user: nextProps.auth.apiUser.user,
      });
    }
  }

  // Set the propTypes
  static propTypes = propTypes_;

  // Pass this function to the form component visuals.
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { name, description, img, tracks } = this.state;
    const { addedTracks, sending } = this.props.playlist;
    return (
      <div>
        <h3 className="ml-3 mt-4">Fill the data for your playlist!</h3>
        {/* GeneralForm pass: name, description, img, onChange() */}
        <h4 className="ml-3 mt-4">General information</h4>
        <GeneralForm
          name={name}
          description={description}
          img={img}
          onChange={this.onChange}
        />
        {/* AddedTracks pass: tracks, deleteTrack() */}
        <div className="container">
          <h4 className="ml-3 mt-4">Selected tracks</h4>
          <CurrentTracks
            tracks={addedTracks}
            deleteTrack={this.props.removeTrack}
          />
          { sending ? <LinearProgress /> : null}
          <form onSubmit={this.onSubmit}>
            <input type="submit" value="Send" className="btn btn-primary"/>
          </form>
        </div>
        
        {/* TrackForm pass: addTrack() */}
        <TrackSearchComponent />
        
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  playlist: state.playlist,
});

export default connect(
  mapStateToProps,
  { removeTrack, sendPlaylist }
)(withRouter(PlaylistFormComponent));
