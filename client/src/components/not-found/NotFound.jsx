import React from 'react';
import logo from '../../logo.png';
import { Link, withRouter } from 'react-router-dom';

class NotFound extends React.Component {
  componentDidMount() {
    
  }
  render() {
    return (
      <div className="container" style={{marginLeft: '37.5%'}}>
        <img src={logo} className="App-logo" alt="logo" style={{width: '300px', height: '300px', marginLeft: '7.5%'}} />
        <h1 style={{ marginTop: '2%', marginLeft: ''}}>We are not able to find that :(</h1>
          <h3 style={{ marginTop: '2%', marginLeft: '5%'}}>
            <Link to="/me/profile">
              Wanna go back to your profile?
            </Link>
          </h3>
      </div>
    );
  }
}

export default withRouter(NotFound)