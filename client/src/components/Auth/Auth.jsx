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
        user: nextProps.auth.currentUser
      })
    }
  }

  componentDidMount() {
    if (
      this.props.auth.currentUser &&
      Object.keys(this.props.auth.currentUser).length > 0 &&
      this.state.user.empty
    ) {
      this.setState({
        user: this.props.auth.currentUser
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
          <h1 className="container">Welcome to LastRater, {user.name}! </h1>
        ) : (
          <LinearProgress />
        )}
        <ArtistsUser history={this.props.history} />
      </div>
    )
  }
}

const mapStateToProps = state => ({ auth: state.auth })

export default connect(
  mapStateToProps,
  { setUser }
)(Auth)
