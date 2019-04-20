import React, { Component } from 'react';
import { connect } from 'react-redux';
import {} from '../../actions/authActions';

class Register extends Component {
  state = {
    email: '',
    password: '',
    password2: '',
    username: '',
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    if (this.props.auth.auth) {
      this.props.history.push('/me/profile');
    }
  }

  componentSubmit = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="container jumbotron mt-3">
        <h1 className="ml-3">Register</h1>
        <form onSubmit={this.componentSubmit}>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
          />
          <input
            type="password"
            name="password2"
            value={this.state.password2}
            onChange={this.onChange}
          />
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
export default connect(
  mapStateToProps,
  {}
)(Register);
