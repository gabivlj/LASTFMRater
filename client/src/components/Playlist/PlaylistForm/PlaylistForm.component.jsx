import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GeneralForm from './visuals/GeneralForm'
import CurrentTracks from './Track/current/CurrentTracks'
import TrackSearchComponent from './Track/TrackSearch.component'
import { removeTrack } from '../../../actions/playlistActions'

const propTypes_ = {
  auth: PropTypes.object.isRequired
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

  componentWillReceiveProps(nextProps) {
    // const { playlist } = nextProps
    // if (
    //   playlist.addedTracks.length !== this.props.playlist.addedTracks.length
    // ) {
    //   const { addedTracks } = playlist
    // }
  }

  // Set the propTypes
  static propTypes = propTypes_

  // Pass this function to the form component visuals.
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { name, description, img, tracks } = this.state
    const { addedTracks } = this.props.playlist
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
          <CurrentTracks
            tracks={addedTracks}
            deleteTrack={this.props.removeTrack}
          />
        </div>
        {/* TrackForm pass: addTrack() */}
        <TrackSearchComponent />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  playlist: state.playlist
})

export default connect(
  mapStateToProps,
  { removeTrack }
)(PlaylistFormComponent)
