import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setUser } from '../../actions/authActions';

const __propTypes = {
  setUser: PropTypes.func.isRequired,
};

class AuthHandler extends Component {
  static propTypes = __propTypes;

  componentDidMount(nextProps) {
    if (this.props.match.params.token === '') {
      this.props.history.push('/');
    }
    if (this.props.match.params.token && this.props.auth.auth) {
      this.props.setUser(
        this.props.match.params.token,
        this.props.auth.apiUser.user,
        this.props.history
      );
    }
  }

  componentWillMount() {
    // localStorage.removeItem('session')
  }

  render() {
    return <div>Handling some stuff...</div>;
  }
}

const mapStateToProps = state => ({ auth: state.auth });

export default connect(
  mapStateToProps,
  { setUser }
)(AuthHandler);
