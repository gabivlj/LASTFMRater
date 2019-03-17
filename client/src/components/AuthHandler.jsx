import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setUser } from '../actions/authActions'

class AuthHandler extends Component {
  componentDidMount() {
    if (this.props.match.params.token) {
      console.log(this.props.match.params.token)
      this.props.setUser(this.props.match.params.token)
    }
  }
  componentWillUpdate(next) {
    if (next.auth.auth) {
      localStorage.setItem('session', JSON.stringify(next.auth.currentUser))
      this.props.history.push(`/me/profile`)
    }
  }
  render() {
    return <div>Handling some stuff...</div>
  }
}

const mapStateToProps = state => ({ auth: state.auth })

export default connect(
  mapStateToProps,
  { setUser }
)(AuthHandler)
