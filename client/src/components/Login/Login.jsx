import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logIn } from '../../actions/authActions';
import InputBorderline from '../Common/InputBorderline';
import logo from '../../logo.png';
import store from '../../store'

class Login extends Component {
  state = {
    email: '',
    password: '',
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

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
    e.preventDefault();
    this.props.logIn(this.state);
  };

  componentWillUnmount() {
    this.cleanErrors();
  }

  cleanErrors = () => {
    store.dispatch({
      type: 'SET_ERRORS_LOGIN',
      payload: {}
    });
  }

  render() {
    const { errors } = this.props.auth
    return (
      <div className="container jumbotron mt-3">
        <img src={logo} className="App-logo" alt="logo" style={{width:'200px', height:'200px', marginLeft: '40%'}}/>
        <h1 className="ml-3">Login</h1>
        <form onSubmit={this.componentSubmit}>
          <InputBorderline          
            type="email"
            name="email"
            label="Email"
            value={this.state.email}
            onChange={this.onChange}
            multiline={false}
            error={(errors['email'] || '') || (errors['auth'] || '')}
            cleanErrors={this.cleanErrors}
          />
          <InputBorderline
            type="password"
            name="password"
            label="Password"
            value={this.state.password}
            onChange={this.onChange}
            multiline={false}
            error={errors['password'] || ''}
            cleanErrors={this.cleanErrors}        
          />
          <br/>
          <input type="submit"  className="btn btn-primary mt-3" value="Log in" />
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
  { logIn }
)(Login);
