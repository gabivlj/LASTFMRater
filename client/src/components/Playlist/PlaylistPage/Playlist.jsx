import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getPlaylist, deleteTrackFromPlaylist, addToPlaylistFromPlaylistEdit } from '../../../actions/playlistActions';
import hourFormat from '../../../utils/hourFormat';
import { LinearProgress, Button } from '@material-ui/core';
import './Playlist.styles.css'
import TrackSearchComponent from '../PlaylistForm/Track/TrackSearch.component';
import guiidGenerator from '../../../utils/idCreator';

class Playlist extends Component {
  state = {
    edit: false
  }

  componentWillMount() {
    this.props.getPlaylist(this.props.match.params.id);
  }

  deleteTrack(trackId, index = null) {
    console.log(index);
    this.props.deleteTrackFromPlaylist(trackId, this.props.playlist._id, index);
  }

  render() {
    const { playlist } = this.props;
    const { tracksShow } = playlist;
    const { user } = this.props;
    const { edit } = this.state;
    let trackRender;
    if (tracksShow && tracksShow.length > 0) {
      trackRender = tracksShow.map((track, index) => 
      <li
        key={guiidGenerator()}
        className="list-group-item d-flex justify-content-between align-items-center"
        draggable={edit}
      >
        {track.name} by {track.artist}
        <span>{edit ? 
          <button             
            className="fa fa-trash" onClick={() => this.deleteTrack(track._id, index)}/>
           : null}</span>
        <span className="badge badge-primary badge-pill">          
          {hourFormat.fmtMS(track.duration)}
        </span>
      </li>
      );    
    }

    // duration = playlist.tracks.reduce(
    //   (total, current) => total + parseInt(current.duration),
    //   0
    // );
    console.log(trackRender);
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
                  Created by: <h5>{playlist.user}</h5>
                  Description: 
                  <p>{playlist.playlistDescription}</p>
                  
                </div>
                <div className="col-md-10">
                  {trackRender}
                </div>
              </div>
            </div>
            : <LinearProgress />            
        }
          <div>
            <TrackSearchComponent addTrackOverride={(track) => { 
              track.user = this.props.user;
              this.props.addToPlaylistFromPlaylistEdit(track, this.props.playlist._id);
              }} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  playlist: state.playlist.playlist,
  user: state.auth.apiUser.user
});
export default connect(mapStateToProps, { getPlaylist, deleteTrackFromPlaylist, addToPlaylistFromPlaylistEdit })(Playlist)