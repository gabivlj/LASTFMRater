import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TrackPlaylist.styles.css';
import store from '../../../../store';
import { connect } from 'react-redux';

/**
 * @description Functional component that represents the track from the array and handles all the dragging
 */
function TrackPlaylist({index, name, artist, duration, deleteTrack, id, edit, currentDragTrack}) {
  const [classNameBorder, setClassNameBorder] = useState('');

  function onDragStart() {
    // ? Set on Redux current dragging track. 
    store.dispatch({
      type: 'SET_CURRENT_TRACK_DRAG',
      payload: {
        index,
        name,
        artist,
        duration,
        id,
      }
    });
  }

  /** 
   * @param {Event} event
   * @description On Drop, if the index is not the same, change the position (api call)
   * */
  function onDrop(event) {
    setClassNameBorder('');
    // TODO API Call to change.
  }

  function onDragOver(event) {
    // This is a bug with React or JSX, we need this to make onDrop fire for some reason.
    event.stopPropagation();
    event.preventDefault();
    setClassNameBorder('blue-border');
  }

  function onDragExit() {
    setClassNameBorder('');
  }

  return (    
    <li      
      className={"list-group-item d-flex justify-content-between align-items-center " +  classNameBorder}
      draggable={edit}
      onDragOver={onDragOver}
      onDragLeave={onDragExit}
      onDrop={onDrop}
      onDragStart={onDragStart}
    >
      {index + 1}. {'    '} {name} by {artist}
      <span>{edit ? 
        <button             
          className="fa fa-trash" onClick={() => deleteTrack(id, index)}/>
          : null}</span>
      <span className="badge badge-primary badge-pill">          
        {duration}
      </span>
    </li>    
  );
}

TrackPlaylist.propTypes = {
  name: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  deleteTrack: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  currentDragTrack: PropTypes.object
};

TrackPlaylist.defaultProps = {
  currentDragTrack: undefined
}

const mapStateToProps = (state) => ({
  currentDragTrack: state.playlist.currentDragTrack
})

export default connect(mapStateToProps, {})(TrackPlaylist);