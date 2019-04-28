import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPlaylists } from '../../../actions/profileActions';

function PlaylistShowcase({ playlists, ...props }) {
  return (
    <div>
      
    </div>
  )
};

PlaylistShowcase.propTypes = {
  getPlaylists: PropTypes.func.isRequired,
  playlists: PropTypes.array.isRequired,
}

export default connect(mapStateToProps, {
  getPlaylists
})(PlaylistShowcase);