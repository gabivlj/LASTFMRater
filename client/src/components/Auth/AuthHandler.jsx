import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setUser } from '../../actions/authActions'
import PropTypes from 'prop-types'

const __propTypes = {
  setUser: PropTypes.func.isRequired
}

class AuthHandler extends Component {
  static propTypes = __propTypes

  componentDidMount() {
    if (this.props.match.params.token) {
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
