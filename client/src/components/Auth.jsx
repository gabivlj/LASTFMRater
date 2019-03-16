import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setUser } from '../actions/authActions'
import ArtistsUser from './ArtistsUser'
class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  componentDidMount() {
    if (!this.state.user) {
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
        {user
          ? `Welcome to my app, ${user.name}! `
          : 'No user was received, please go back'}
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
