import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setUsersArtists } from '../../actions/authActions'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { LinearProgress } from '@material-ui/core'

const __propTypes = {
  setUsersArtists: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const isArray = a => {
  return !!a && a.constructor === Array
}

class ArtistsUser extends Component {
  static propTypes = __propTypes
  componentDidMount() {
    if (
      this.props.auth.apiUser &&
      this.props.auth.apiUser.lastfm &&
      this.props.auth.auth &&
      Object.keys(this.props.auth.artists).length === 0
    ) {
      this.props.setUsersArtists(this.props.auth.apiUser.lastfm) //this.props.auth.currentUser.name
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   if (
  //     nextProps.auth.apiUser &&
  //     nextProps.auth.apiUser.lastfm &&
  //     nextProps.auth.auth &&
  //     Object.keys(this.props.auth.artists).length === 0
  //   ) {
  //     this.props.setUsersArtists(nextProps.auth.currentUser.name) //this.props.auth.currentUser.name
  //   }
  // }
  render() {
    const { auth } = this.props
    let artist
    let artists

    // We do this because if artist param has only one artist, it will be an object and not an array.
    if (auth.artists.artists) {
      artists = auth.artists.artists
      artist = isArray(artists.artist)
        ? artists.artist.slice(0, 10)
        : [artists.artist]
    }

    return (
      <div className="container">
        <div className="badge badge-primary">
          <h1>Your artists </h1>
        </div>
        <div className="row" style={{ paddingBottom: '10%' }}>
          {artists && artist ? (
            artist.map((artist, index) => (
              <div className="col-md-4 mt-3" key={index}>
                <div className="card" style={{ width: '100%' }}>
                  <img
                    className="card-img-top"
                    src={artist.image[4]['#text']}
                    alt=""
                  />
                  <div className="card-body">
                    <h5 className="card-title">{artist.name}</h5>
                    <p className="card-text">
                      Times played: {artist.playcount}
                    </p>
                    <Link
                      to={`/artist/${artist.name}`}
                      className="btn btn-primary"
                    >
                      Go to artists page
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <LinearProgress />
          )}
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
