import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logIn } from '../../actions/authActions';
import store from '../../store';
import PropTypes from 'prop-types';
import SignInTest from '../Test/SignInTest';

const propTypes = {
  auth: PropTypes.object.isRequired,
  logIn: PropTypes.func.isRequired,
};

class Login extends Component {
  static propTypes = propTypes;

  state = {
    email: { label: 'Email address', value: '', autoComplete: 'email' },
    password: { label: 'Password', value: '', autoComplete: 'password' },
  };

  onChange = e => {
    this.setState({
      ...this.state,
      [e.target.name]: { ...this.state[e.target.name], value: e.target.value },
    });
  };

  componentDidMount() {
    if (this.props.auth.auth) {
      const { apiUser } = this.props.auth;
      const { user } = apiUser;
      this.props.history.push(`/profile/${user}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.auth) {
      const { apiUser } = nextProps.auth;
      const { user } = apiUser;
      this.props.history.push(`/profile/${user}`);
    }
  }

  componentSubmit = e => {
    e.preventDefault();
    this.props.logIn({
      email: this.state.email.value,
      password: this.state.password.value,
    });
  };

  componentWillUnmount() {
    this.cleanErrors();
  }

  cleanErrors = () => {
    store.dispatch({
      type: 'CLEAN_ERRORS',
    });
  };

  render() {
    const { errors } = this.props.auth;
    return (
      <SignInTest
        title="Sign into Grampy!"
        errors={errors}
        onChange={this.onChange}
        state={this.state}
        onSubmit={this.componentSubmit}
      />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
export default connect(
  mapStateToProps,
  { logIn },
)(Login);
