import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAlbum } from '../../actions/albumActions'
import store from '../../store'
import hourFormat from '../../utils/hourFormat'
import AlbumRating from './AlbumRating'
import PropTypes from 'prop-types'

const __propTypes = {
  getAlbum: PropTypes.func.isRequired,
  album: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
}

class Album extends Component {
  static propTypes = __propTypes
  constructor(props) {
    super(props)
    this.state = {
      artist: '',
      album: null
    }

    // There is a delay with this.setState that'd bug the componentDidUpdate()
    this.loadedAlbum = false
  }
  componentWillUnmount() {
    store.dispatch({
      type: 'CLEAR_ALBUM'
    })
  }
  componentDidMount() {
    const { artist, albumname, mbid } = this.props.match.params
    this.setState({
      artist
    })

    this.props.getAlbum({
      artist,
      albumname,
      mbid,
      username: this.props.currentUser ? this.props.currentUser.name : null
    })
  }
  componentDidUpdate() {
    if (!this.loadedAlbum && this.props.album.album) {
      this.setState({
        album: this.props.album.album.album
      })
      this.loadedAlbum = true
    }
  }
  render() {
    const { album } = this.state
    let tracks
    let duration
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
      ))
      duration = album.tracks.track.reduce(
        (total, current) => total + parseInt(current.duration),
        0
      )
    }

    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            {album ? (
              <div>
                <div className="row">
                  <div className="col-md-4 " style={{ marginTop: '10%' }}>
                    <h1 className="display-6">{this.state.artist}</h1>
                    <h2 className="display-3">{album.name}</h2>
                    <p>{album.mbid}</p>
                    {album.userplaycount ? (
                      <h5>
                        {this.props.currentUser.name}'s playcount:{' '}
                        {album.userplaycount}
                      </h5>
                    ) : null}
                  </div>
                  <div className="col-md-4">
                    <img
                      style={{ borderRadius: '3%' }}
                      alt="Album"
                      src={album.image[3]['#text']}
                    />
                  </div>
                </div>
                <h5 className="mt-3 ">Track list:</h5>
                <ul className="list-group mt-3 w-50">{tracks}</ul>
                <div className="badge badge-primary">
                  Playcount: {album.playcount}
                </div>
                <div className="badge badge-primary ml-3">
                  Listeners: {album.listeners}
                </div>
                <div className="badge badge-primary ml-3">
                  Total duration: {hourFormat.fmtMSS(duration)}
                </div>
                {/*TODO: Pass album and currentUser props so it has better performance and it's more useful but whatever*/}
                <AlbumRating />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  album: state.album,
  currentUser: state.auth.currentUser
})
export default connect(
  mapStateToProps,
  { getAlbum }
)(Album)
