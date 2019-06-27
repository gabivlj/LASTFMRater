import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LinearProgress } from '@material-ui/core';
import { getAlbum, addAlbumRating, addComment, likeComment } from '../../actions/albumActions';
import store from '../../store';
import hourFormat from '../../utils/hourFormat';
import RatingsCommon from '../Common/RatingsCommon';
import { Link } from 'react-router-dom';
import CommentShowcase from '../CommentSection/CommentShowcase';
import CommentComponent from '../CommentSection/Common/CommentComponent';

const __propTypes = {
  getAlbum: PropTypes.func.isRequired,
  album: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

class Album extends Component {
  static propTypes = __propTypes;
  
  constructor(props) {
    super(props);
    this.state = {
      artist: '',
      album: null,
    };

    // There is a delay with this.setState that'd bug the componentDidUpdate()
    this.loadedAlbum = false;
  }

  componentWillUnmount() {
    store.dispatch({
      type: 'CLEAR_ALBUM',
    });
  }

  componentDidMount() {
    const { artist, albumname, mbid } = this.props.match.params;
    this.setState({
      artist,
    });
    this.props.getAlbum({
      artist,
      albumname,
      mbid,
      userId: 
        this.props.currentUser
          ? this.props.currentUser.id
          : null,
      username:
        this.props.currentUser && this.props.currentUser.lastfm
          ? this.props.currentUser.lastfm
          : null,
    });
  }

  componentDidUpdate() {
    if (!this.loadedAlbum && this.props.album.album) {
      this.setState({
        album: this.props.album.album.album,
      });
      this.loadedAlbum = true;
    }
  }

  render() {
    let { album } = this.props;
    const { currentUser, addComment, likeComment } = this.props;
    if (album) album = album.album;
    if (album) album = album.album;
    let tracks;
    let duration;
    if (album) {
      // Map through every track
      tracks = album.tracks.track.map((tr, index) => (
        <li
          key={index}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          {tr.name}
          <span className="badge badge-primary badge-pill">
            {hourFormat.fmtMSS(tr.duration)}
          </span>
        </li>
      ));
      duration = album.tracks.track.reduce(
        (total, current) => total + parseInt(current.duration),
        0
      );
    }

    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            {album ? <div>
              <div className="row">
                <div className="col-md-4 " style={{marginTop: '10%'}}>
                  <h1 className="display-6">
                    <Link to={`/artist/${this.state.artist}`}>
                      {this.state.artist}
                    </Link>
                  </h1>
                  <h2 className="display-3">{album.name}</h2>
                  <p>{album.mbid}</p>
                  {album.userplaycount ? (
                      <h5>
                        {this.props.currentUser ? this.props.currentUser.user : ''}'s playcount:{' '}
                        {album.userplaycount}
                      </h5>
                  ) : null}
                </div>
                <div className="col-md-4">
                  <img
                      style={{borderRadius: '3%'}}
                      alt="Album"
                      src={album.image[3]['#text']}
                  />
                </div>
              </div>
              <RatingsCommon
                  ratings={album.ratings}
                  auth={this.props.currentUser || null}
                  elementWithRatings={album}
                  setRatings={this.props.addAlbumRating}
                  username={!this.props.currentUser ? '' : this.props.currentUser.user}
                  elementId={album._id}
              />
              <h5 className="mt-3 ">Track list:</h5>
              <ul className="list-group mt-3 w-100">
                {tracks && tracks.length > 0
                    ? tracks
                    : 'There are no tracks listed on this album, wanna add one? Collaborate!'}
              </ul>
              <div className="badge badge-primary mt-3">
                Playcount: {album.playcount}
              </div>
              <div className="badge badge-primary ml-3 mt-3">
                Listeners: {album.listeners}
              </div>
              <div className="badge badge-primary ml-3 mt-3">
                Total duration: {hourFormat.fmtMSS(duration)}
              </div>
              <br/>
              {/* TODO: We are cuerrently testing this component for reusable. */}
              <div style={{margin: '50px 0 20px 0'}}>
                {/* <CommentSection
                    user={currentUser}
                    addComment={addComment}
                    comments={album.comments}
                    likeComment={likeComment}
                    dislikeComment={() => console.log("nope")}
                    objectId={album._id}
                  /> */}
                {/* <CommentShowcase
                    comments={album.comments}
                    objectId={album._id}
                    type={'album'}
                /> */}
                <CommentComponent
                  objectId={album._id}
                />
              </div>
            </div> : <LinearProgress/>}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  album: state.album,
  currentUser: state.auth.apiUser,
  auth: state.auth,
});
export default connect(
  mapStateToProps,
  { getAlbum, addAlbumRating, addComment, likeComment }
)(Album);
