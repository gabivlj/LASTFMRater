import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getPlaylist, deleteTrackFromPlaylist, addToPlaylistFromPlaylistEdit } from '../../../actions/playlistActions';
import hourFormat from '../../../utils/hourFormat';
import { LinearProgress } from '@material-ui/core';
import './Playlist.styles.css'
import TrackSearchComponent from '../PlaylistForm/Track/TrackSearch.component';
import guiidGenerator from '../../../utils/idCreator';
import PropTypes from 'prop-types';
import TrackPlaylist from './TrackPlaylist/TrackPlaylist';
import PlaylistRating from './PlaylistRating/PlaylistRating';
import { Link } from 'react-router-dom';
import CommentShowcase from '../../CommentSection/CommentShowcase';

const propTypes = {
  user: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  playlist: PropTypes.object.isRequired,
  getPlaylist: PropTypes.func.isRequired,
  deleteTrackFromPlaylist: PropTypes.func.isRequired,
  addToPlaylistFromPlaylistEdit: PropTypes.func.isRequired
};

class Playlist extends Component {
  static propTypes = propTypes
  state = {
    edit: false
  }

  componentDidMount() {
    this.props.getPlaylist(this.props.match.params.id, this.props.auth.apiUser ? this.props.auth.apiUser.id : null);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.auth.apiUser && !this.props.auth.auth) {
      this.props.getPlaylist(this.props.match.params.id, this.props.auth.apiUser ? this.props.auth.apiUser.id : null);
    }
  }

  render() {
    const { playlist } = this.props;
    const { tracksShow } = playlist;
    const { user, auth } = this.props;
    const { edit } = this.state;
    let trackRender;
    if (tracksShow && tracksShow.length > 0) {
      trackRender = tracksShow.map((track, index) => 
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
      );    
    }
    
    return (
      <div className="jumbotron">              
        <div className="container">
        {
          playlist && playlist.playlistName ? 
            <div className="mt-3">
              <div className="row">
                <div className="col-md-2">
                  {user === playlist.user ? 
                    <button 
                      className="btn btn-primary mb-3" 
                      onClick={() => this.setState({ edit: !this.state.edit})}
                    >
                     {edit ? 'Editing!' : 'Edit playlist' }
                    </button> 
                    : null}
                  <h2>{playlist.playlistName.toUpperCase()}</h2> 
                  Created by: <Link to={`/profile/${playlist.user}`}><h5>{playlist.user}</h5></Link>
                  Description: 
                  <p>{playlist.playlistDescription}</p>
                  
                </div>
                <div className="col-md-10">
                  {trackRender}
                  <div>
                    <PlaylistRating
                      playlist={playlist}
                      auth={auth}
                    />
                  </div>         
                </div>
              </div>
            </div>
            : <LinearProgress />            
        }          
          <div>
            {
            user === playlist.user ? 
              <TrackSearchComponent addTrackOverride={(track) => { 
                track.user = this.props.user;
                this.props.addToPlaylistFromPlaylistEdit(track, this.props.playlist._id);
               }} />
              : null 
            }
            <CommentShowcase
                comments={playlist.comments}
                objectId={playlist._id}
                type={'playlist'}                    
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  playlist: state.playlist.playlist,
  user: state.auth.apiUser.user,
  auth: state.auth,
});

export default connect(mapStateToProps, { getPlaylist, deleteTrackFromPlaylist, addToPlaylistFromPlaylistEdit })(Playlist)