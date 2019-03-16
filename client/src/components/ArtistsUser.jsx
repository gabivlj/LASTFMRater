import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setUsersArtists } from '../actions/authActions'
import { Link } from 'react-router-dom'

const isArray = a => {
  return !!a && a.constructor === Array
}
class ArtistsUser extends Component {
  componentDidMount() {
    if (
      this.props.auth.currentUser &&
      Object.keys(this.props.auth.artists).length === 0
    ) {
      this.props.setUsersArtists(this.props.auth.currentUser.name)
    } else if (!this.props.auth.currentuser) {
      this.props.history.push('/')
    }
  }
  componentWillReceiveProps(nextProps) {}
  render() {
    const { auth } = this.props
    let artist
    let artists

    // We do this because if artist param has only one artist, it will be an object and not an array.
    if (auth.artists.artists) {
      artists = auth.artists.artists
      artist = isArray(artists.artist) ? artists.artist : [artists.artist]
    }

    return (
      <div className="container">
        <h1>Your artists!: </h1>
        <div className="row">
          {artists && artist
            ? artist.map(artist => (
                <div className="col-md-4">
                  <div class="card" style={{ width: '100%' }}>
                    <img
                      className="card-img-top"
                      src={artist.image[4]['#text']}
                      alt=""
                    />
                    <div class="card-body">
                      <h5 class="card-title">{artist.name}</h5>
                      <p class="card-text">Times played: {artist.playcount}</p>
                      <Link
                        to={`/artist/${artist.name}/${artist.mbid}`}
                        className="btn btn-primary"
                      >
                        Go to artists page
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(
  mapStateToProps,
  { setUsersArtists }
)(ArtistsUser)
