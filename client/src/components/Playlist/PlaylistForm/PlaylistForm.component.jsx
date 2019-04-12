import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GeneralForm from './visuals/GeneralForm'
import CurrentTracks from './Track/current/CurrentTracks'

const propTypes_ = {
  auth: PropTypes.object.isRequired
}
const ___IsEqualTheTrack = (track1, track2) => {
  return (
    track1.name === track2.name &&
    track1.artist === track2.artist &&
    // Check if it's an api track, if it's not use listeners param to check if they're equal. ( Holy... Lastfm's api no mbid guaranteed is bad...)
    (track1._id
      ? track1._id === track2._id
      : track1.listeners === track2.listeners)
  )
}

class PlaylistFormComponent extends Component {
  constructor() {
    super()
    this.state = {
      tracks: [], // pass it to visuals/TrackList.jsx
      name: '', // pass it to visuals/FormInfo
      description: '', // pass it to visuals/FormInfo
      user: null, // api purposes
      img: '' // pass it to visuals/FormInfo (playlistCover)
    }
  }

  // React.lifecycles
  componentDidMount() {
    console.log(this.props.auth)
    if (!this.props.auth.apiUser && !this.props.auth.auth) {
      // TODO PUSH NOTIFICATION TO INFORM THAT HE HAS BEEN REDIRECTED !
      // this.props.history.push('/')
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.auth.apiUser && !this.state.user) {
      this.setState({
        user: nextProps.auth.apiUser._id
      })
    }
  }

  // Set the propTypes
  static propTypes = propTypes_

  // Pass this function to the form component visuals.
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  /**
   * @COMPONENTFOR <TrackFinder />
   * @COMPONENTTYPE VISUAL
   * @DESCRIPTION Func. we're gonna use for adding tracks to the state.
   */
  addTrack = track => {
    this.setState({ tracks: [...this.state.tracks, track] })
    return this.state.tracks
  }

  /**
   * @COMPONENTFOR <TrackList />
   * @COMPONENTTYPE VISUAL
   * @DESCRIPTION Func. we're gonna use for deleting tracks from the state.
   */
  deleteTrack = trackToCheck => {
    const { tracks_ } = this.state
    this.setState({
      tracks: [
        ...tracks_.filter(track => !___IsEqualTheTrack(track, trackToCheck))
      ]
    })
    return this.state.tracks
  }

  render() {
    const { name, description, img, tracks } = this.state
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
          <CurrentTracks tracks={tracks} />
        </div>
        {/* TrackForm pass: addTrack() */}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(
  mapStateToProps,
  {}
)(PlaylistFormComponent)
