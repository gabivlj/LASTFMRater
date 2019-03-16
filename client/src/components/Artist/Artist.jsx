import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getArtist } from '../../actions/artistActions'
class Artist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      artist: null
    }
  }
  componentDidMount() {
    this.props.getArtist({
      name: this.props.match.params.name,
      mbid: this.props.match.params.mbid
    })
  }
  componentDidUpdate() {
    if (!this.state.artist && this.props.artist.artist) {
      this.setState({
        artist: this.props.artist.artist.artist
      })
    }
  }
  render() {
    let { artist } = this.state

    return (
      <div>
        {artist ? (
          <div className="jumbotron">
            <div className="container">
              <h1 className="display-4">{artist.name}</h1>
              <div className="container m-4">
                <img
                  src={artist.image[4]['#text']}
                  style={{
                    height: 'auto',
                    width: '40%'
                  }}
                  className="rounded"
                  alt="Responsive"
                />
              </div>
            </div>
            <p className="lead">{artist.bio.summary.split('<')[0]}</p>
            {artist.tags.tag.map(t => (
              <span className="badge badge-primary ml-3">{t.name}</span>
            ))}
            <br />

            <hr className="my-4" />

            <div
              className={`badge ${
                artist.ontour > 0 ? 'badge-success' : 'badge-danger'
              } mb-2`}
            >
              <h6 className="m-2">
                {artist.ontour > 0 ? 'On tour!' : 'Not on tour...'}
              </h6>
            </div>

            <div className="badge badge-primary ml-2 mt-2 mb-2">
              <i
                style={{ color: 'white' }}
                className="fa fa-play mt-3"
                aria-hidden="true"
              />
              <p className="mt-2" style={{ fontSize: '13px' }}>
                {artist.stats.playcount} plays
              </p>
            </div>
            <p className="lead">
              <a className="btn btn-primary btn-lg" href="/" role="button">
                Learn more
              </a>
            </p>
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  artist: state.artist
})
export default connect(
  mapStateToProps,
  { getArtist }
)(Artist)
