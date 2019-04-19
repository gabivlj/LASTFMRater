import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logIn } from '../../actions/authActions'

class Login extends Component {
  state = {
    email: '',
    password: ''
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    if (this.props.auth.auth) {
      this.props.history.push('/me/profile');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.auth) {
      this.props.history.push('/me/profile');
    }
  }

  componentSubmit = e => {
    e.preventDefault()
    this.props.logIn(this.state)
  }

  render() {
    return (
      <div className="container jumbotron mt-3">
        <h1 className="ml-3">Login</h1>
        <form onSubmit={this.componentSubmit}>
          <input
            type="email"
            name="email"
            value={this.state['email']}
            onChange={this.onChange}
          />
          <input
            type="password"
            name="password"
            value={this.state['password']}
            onChange={this.onChange}
          />
          <input type="submit" value="Log in" />
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})
export default connect(
  mapStateToProps,
  { logIn }
)(Login)
