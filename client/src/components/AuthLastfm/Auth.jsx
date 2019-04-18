import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setUser } from '../../actions/authActions'
import ArtistsUser from './ArtistsUser'
import PropTypes from 'prop-types'
import { LinearProgress } from '@material-ui/core'

const __propTypes = {
  setUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

class Auth extends Component {
  static propTypes = __propTypes

  constructor(props) {
    super(props)
    this.state = {
      user: { empty: true }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.state.user.empty &&
      nextProps.auth.currentUser &&
      Object.keys(nextProps.auth.currentUser)
    ) {
      this.setState({
        user: nextProps.auth.apiUser
      })
    }
  }

  componentDidMount() {
    if (
      this.props.auth.apiUser &&
      Object.keys(this.props.auth.apiUser).length > 0 &&
      this.state.user.empty
    ) {
      this.setState({
        user: this.props.auth.apiUser
      })
    }
  }

  render() {
    const { user } = this.state
    if (!user) {
    }
    return (
      <div>
        {!user.empty ? (
          <h1 className="container">Welcome to LastRater, {user.user}! </h1>
        ) : (
          <LinearProgress />
        )}
        {!user.lastfm || user.lastfm.trim() === '' ? (
          <h2>
            Pair your current Lastfm account with this account to get all the
            advantages!
          </h2>
        ) : (
          <ArtistsUser history={this.props.history} />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({ auth: state.auth })

export default connect(
  mapStateToProps,
  { setUser }
)(Auth)
