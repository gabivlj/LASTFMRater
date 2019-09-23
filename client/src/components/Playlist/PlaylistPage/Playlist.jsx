import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getPlaylist,
  deleteTrackFromPlaylist,
  addToPlaylistFromPlaylistEdit,
  cleanPlaylist,
} from '../../../actions/playlistActions';
import hourFormat from '../../../utils/hourFormat';
import { LinearProgress } from '@material-ui/core';
import './Playlist.styles.css';
import TrackSearchComponent from '../PlaylistForm/Track/TrackSearch.component';
import guiidGenerator from '../../../utils/idCreator';
import PropTypes from 'prop-types';
import TrackPlaylist from './TrackPlaylist/TrackPlaylist';
import PlaylistRating from './PlaylistRating/PlaylistRating';
import UserRoute from './Util/UserRoute';
import InvisibleInput from '../../Common/InvisibleInput';
import CommentComponent from '../../CommentSection/Common/CommentComponent';

const propTypes = {
  user: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  playlist: PropTypes.object.isRequired,
  getPlaylist: PropTypes.func.isRequired,
  deleteTrackFromPlaylist: PropTypes.func.isRequired,
  addToPlaylistFromPlaylistEdit: PropTypes.func.isRequired,
};

class Playlist extends Component {
  static propTypes = propTypes;
  state = {
    edit: false,
    username: '',
    playlistName: '',
    playlistDescription: '',
  };

  componentDidMount() {
    this.props.getPlaylist(
      this.props.match.params.id,
      this.props.auth.apiUser ? this.props.auth.apiUser.id : null,
    );
  }

  componentWillUpdate(nextProps) {
    if (nextProps.auth.apiUser && !this.props.auth.auth) {
      this.props.getPlaylist(
        this.props.match.params.id,
        this.props.auth.apiUser ? this.props.auth.apiUser.id : null,
      );
    }

    if (
      this.state.username === '' &&
      nextProps.playlist &&
      nextProps.playlist.user
    ) {
      this.setState({
        username: nextProps.playlist.user,
        playlistName: nextProps.playlist.playlistName,
      });
    }
  }

  componentWillUnmount() {
    this.props.cleanPlaylist();
  }

  onSubmitChanges = () => {
    // todo: call api :)
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.textContent,
    });
  };

  render() {
    // refactoring
    const { playlist, user, auth } = this.props;
    const { tracksShow } = playlist;
    const { edit } = this.state;
    // invisible inputs
    const invisibleInputs = {
      custom: name => (
        <InvisibleInput
          text={this.state[name]}
          editable={this.state.edit}
          onChange={this.onChange}
          name={name}
        >
          {this.state[name]}
        </InvisibleInput>
      ),
    };
    // Username render (we don't want user link showing when editing.)
    const usernameRender = !edit ? (
      <UserRoute user={playlist.user} />
    ) : (
      invisibleInputs.custom('username')
    );
    // Track render.
    let trackRender;

    if (tracksShow && tracksShow.length > 0) {
      trackRender = tracksShow.map((track, index) => (
        <TrackPlaylist
          key={guiidGenerator()}
          name={track.name}
          artist={track.artist}
          deleteTrack={this.props.deleteTrackFromPlaylist}
          duration={hourFormat.fmtMS(track.duration)}
          index={index}
          id={track._id}
          edit={edit}
          playlistId={playlist._id}
          tracksShow={tracksShow}
        />
      ));
    }
    return (
      <div className="jumbotron">
        <div className="container">
          {playlist && playlist.playlistName ? (
            <div className="mt-3">
              <div className="row">
                <div className="col-md-2">
                  {user === playlist.user ? (
                    <button
                      className="btn btn-primary mb-3"
                      onClick={() => this.setState({ edit: !this.state.edit })}
                    >
                      {edit ? 'Editing!' : 'Edit playlist'}
                    </button>
                  ) : null}
                  <h2>{playlist.playlistName.toUpperCase()}</h2>
                  Created by: {usernameRender}
                  Description:
                  <InvisibleInput
                    text={playlist.playlistDescription}
                    editable={edit}
                    onChange={this.onChange}
                    name={'playlistDescription'}
                  />
                </div>
                <div className="col-md-10">
                  {trackRender}
                  <div>
                    <PlaylistRating playlist={playlist} auth={auth} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <LinearProgress />
          )}
          <div>
            {user === playlist.user ? (
              <TrackSearchComponent
                addTrackOverride={track => {
                  track.user = this.props.user;
                  this.props.addToPlaylistFromPlaylistEdit(
                    track,
                    this.props.playlist._id,
                  );
                }}
              />
            ) : null}
            <CommentComponent
              objectId={playlist._id}
              name={`${playlist.playlistName} playlist from ${String(
                playlist.user,
              )}`}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playlist: state.playlist.playlist,
  user: state.auth.apiUser.user,
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  {
    getPlaylist,
    deleteTrackFromPlaylist,
    addToPlaylistFromPlaylistEdit,
    cleanPlaylist,
  },
)(Playlist);
