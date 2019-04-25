import React, { Component } from 'react'
import { connect } from 'react-redux';
import KEYS from '../../API';
import PropTypes from 'prop-types';

const propTypes = {
  auth: PropTypes.object.isRequired
};

class Configuration extends Component {
  render() {
    const { lastfm } = this.props.auth.apiUser;
    return (
      <div className="container">
        <div className="m-3">
          <h1>
            Configuration and information
          </h1>
          <h3 className="mt-3 pt-3">
            Current Lastfm Account:
          </h3>
          <h5>{lastfm && lastfm !== '' ? lastfm : 'It seems that there are no accounts linked to this account...'}</h5>
          <a className="btn btn-primary mt-2" href={`http://www.last.fm/api/auth/?api_key=${KEYS.API_KEY}`}>
            {lastfm && lastfm !== '' 
            ? 'Change account' : 'Connect account'}
          </a>          
        </div>
      </div>
    )
  }
}

Configuration.propTypes = propTypes;

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(Configuration)