import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAlbum } from '../../actions/albumActions'
function fmtMSS(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
}
class Album extends Component {
  constructor(props) {
    super(props)
    this.state = {
      artist: '',
      album: null
    }
    this.loadedAlbum = false
  }
  componentDidMount() {
    const { artist, albumname, mbid } = this.props.match.params
    this.setState({
      artist
    })
    this.props.getAlbum({ artist, albumname, mbid })
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
    if (album) {
      tracks = album.tracks.track.map(tr => (
        <li className="list-group-item d-flex justify-content-between align-items-center">
          {tr.name}
          <span className="badge badge-primary badge-pill">
            {fmtMSS(tr.duration)}
          </span>
        </li>
      ))
    }
    console.log(album)
    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            <h1 className="display-6">{this.state.artist}</h1>
            {album ? (
              <div>
                <div className="row">
                  <div className="col-md-4 " style={{ marginTop: '10%' }}>
                    <h2 className="display-2">{album.name}</h2>
                    <p>{album.mbid}</p>
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
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  album: state.album
})
export default connect(
  mapStateToProps,
  { getAlbum }
)(Album)
