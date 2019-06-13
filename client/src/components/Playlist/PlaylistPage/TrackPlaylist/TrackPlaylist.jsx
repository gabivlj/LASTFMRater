import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TrackPlaylist.styles.css';
import store from '../../../../store';
import { connect } from 'react-redux';
import { interchangeTracks } from '../../../../actions/playlistActions';

// source https://stackoverflow.com/questions/49328382/browser-detection-in-reactjs
const IS_FIREFOX = typeof InstallTrigger !== 'undefined';

/**
 * @description Functional component that represents the track from the array and handles all the dragging
 */
function TrackPlaylist({
	index,
	name,
	artist,
	duration,
	deleteTrack,
	id,
	edit,
	currentDragTrack,
	playlistId,
	interchangeTracks,
	tracksShow
}) {
	const [classNameBorder, setClassNameBorder] = useState('');
	const dragElement = useRef(null);
	function deleteT() {
		deleteTrack(id, playlistId, index);
	}

	// UseEffect for checking if the browser is firefox.
	// more information: https://stackoverflow.com/questions/3977596/how-to-make-divs-in-html5-draggable-for-firefox
	useEffect(() => {
		if (edit && IS_FIREFOX) {
			dragElement.current.addEventListener('dragstart', e => {
				e.dataTransfer.setData('FIREFOX', 'PLACEHOLDER');
			});
		}
	}, [edit]);

	function onDragStart() {
		// ? Set on Redux current dragging track.
		store.dispatch({
			type: 'SET_CURRENT_TRACK_DRAG',
			payload: {
				index,
				name,
				artist,
				duration,
				id
			}
		});
	}

	/**
	 * @param {Event} event
	 * @description On Drop, if the index is not the same, change the position (api call)
	 * */
	function onDrop(event) {
		setClassNameBorder('');
		// Check if they're not the same element.
		if (currentDragTrack.index !== index)
			interchangeTracks(currentDragTrack.index, index, playlistId, tracksShow);
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
			className={
				'list-group-item d-flex justify-content-between align-items-center ' +
				classNameBorder
			}
			ref={dragElement}
			draggable={edit}
			onDragOver={onDragOver}
			onDragLeave={onDragExit}
			onDrop={onDrop}
			onDragStart={onDragStart}
		>
			{index + 1}. {'    '} {name} by {artist}
			<span>
				{edit ? <button className="fa fa-trash" onClick={deleteT} /> : null}
			</span>
			<span className="badge badge-primary badge-pill">{duration}</span>
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
	currentDragTrack: PropTypes.object,
	playlistId: PropTypes.string.isRequired,
	interchangeTracks: PropTypes.func.isRequired
};

TrackPlaylist.defaultProps = {
	currentDragTrack: undefined
};

const mapStateToProps = state => ({
	currentDragTrack: state.playlist.currentDragTrack
});

export default connect(
	mapStateToProps,
	{ interchangeTracks }
)(TrackPlaylist);
