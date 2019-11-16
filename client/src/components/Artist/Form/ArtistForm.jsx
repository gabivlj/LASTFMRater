/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ArtistFormInputs from './ArtistFormInputs';
import {
  uploadUpdateArtist,
  uploadImageArtist,
  getArtistForm,
} from '../../../actions/artistActions';

function ArtistForm({
  artist,
  history,
  uploadUpdateArtist,
  uploadImageArtist,
  match,
  getArtistForm,
}) {
  const {
    images = [],
    description = '',
    networks = {},
    name,
    genres = [],
    dateOfBirth = '31/09/2019',
  } = artist;
  const [artistState, setArtistState] = useState({
    description,
    networks,
    images,
    name,
    dateOfBirth,
    genres,
  });

  const [changedState, setChangedState] = useState({});
  useEffect(() => {
    if (!artist.name) {
      getArtistForm({ _id: match.params.id, name: artist.name });
    }
    const {
      images = [],
      description = '',
      networks = {},
      name,
      genres = [],
      dateOfBirth = '2019/09/31',
    } = artist;
    setArtistState({
      description,
      networks,
      images,
      name,
      dateOfBirth,
      genres,
    });
  }, [artist]);

  // TODO: Make a date personalized input to check inputs.
  function onChange(e) {
    if (!changedState[e.target.name])
      setChangedState({ ...changedState, [e.target.name]: true });
    setArtistState({ ...artistState, [e.target.name]: e.target.value });
  }

  function submit() {
    const buildObject = {};
    Object.keys(changedState).forEach(key => {
      buildObject[key] = artistState[key];
    });
    uploadUpdateArtist(buildObject, artist, history);
  }

  function addImage(file) {
    console.log(file);
    uploadImageArtist(file, images, artist._id);
  }

  function reset() {
    setChangedState({});
    setArtistState({
      description,
      networks,
      images,
      name,
      dateOfBirth,
      genres,
    });
  }

  return (
    <div>
      <div className="m-3">
        <h2>{`${name} new suggestion!`}</h2>
      </div>
      <ArtistFormInputs
        onChange={onChange}
        changedState={changedState}
        submit={submit}
        reset={reset}
        artistState={artistState}
        addImage={addImage}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  artist: state.artist.artistForm,
});

export default connect(
  mapStateToProps,
  {
    uploadUpdateArtist,
    uploadImageArtist,
    getArtistForm,
  },
)(withRouter(ArtistForm));
