import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setUser } from '../actions/authActions'

class AuthHandler extends Component {
  componentDidMount() {
    if (this.props.match.params.token) {
      console.log(this.props.match.params.token)
      this.props.setUser(this.props.match.params.token, this.props.history)
    }
  }
  componentWillMount() {
    localStorage.removeItem('session')
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
