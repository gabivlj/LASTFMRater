import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addTrack, searchTracks } from '../../../../actions/playlistActions';
import InputBorderline from '../../../Common/InputBorderline';
import TrackSearch from './visuals/TrackSearch';

const TrackSearchComponent = ({ ...props }) => {
  const { searchedTracks } = props.playlist;

  function searchTrack(query) {
    if (query.trim() !== '') props.searchTracks(query);
  }

  function onSubmit(e) {
    e.preventDefault();
    searchTrack(name);
  }
  const [name, changeName] = useState('');
  return (
    <div className="container">
      <form onSubmit={onSubmit} style={{ paddingBottom: '10%' }}>
        <InputBorderline
          value={name}
          onChange={e => changeName(e.target.value)}
          name="name"
          label="Search a track"
          multiline={false}
        />
        <br />
        <button className="btn-primary btn ml-3">Search</button>
      </form>
      <TrackSearch tracks={searchedTracks} addTrack={props.addTrack} />
    </div>
  );
};

const mapStateToProps = state => ({
  playlist: state.playlist,
});

export default connect(
  mapStateToProps,
  { addTrack, searchTracks }
)(TrackSearchComponent);
