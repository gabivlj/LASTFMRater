import React from 'react';
import { connect } from 'react-redux';

function AlbumForm({ album }) {
  return <div />;
}

const mapStateToProps = state => ({
  album: state.album,
});

export default connect()(AlbumForm);
