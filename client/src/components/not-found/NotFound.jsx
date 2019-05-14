import React from 'react';
import logo from '../../logo.png';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class NotFound extends React.Component {
  render() {
    const { auth } = this.props;
    const messageLink = 
      ( auth.auth && auth.apiUser.user ? (
          <Link to={`/profile/${auth.apiUser.user}`}>
              Wanna go back to your profile?
          </Link>
        ) : (
          <Link to="/">
              Wanna go back to homepage?
          </Link>
        )
      );

    return (
      <div className="container" style={{marginLeft: '37.5%'}}>
        <img src={logo} className="App-logo" alt="logo" style={{width: '300px', height: '300px', marginLeft: '7.5%'}} />
        <h1 style={{ marginTop: '2%', marginLeft: ''}}>We are not able to find that :(</h1>
          <h3 style={{ marginTop: '2%', marginLeft: '5%'}}>
            {messageLink}
          </h3>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(withRouter(NotFound))