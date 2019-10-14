/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import InputBorderline from '../../Common/InputBorderline';

function ArtistForm({ artist }) {
  const {
    images = [],
    description = '',
    networks = {},
    name,
    dateOfBirth = '31/09/2019',
  } = artist;
  const [artistState, setArtistState] = useState({
    description,
    networks,
    images,
    name,
    dateOfBirth,
  });
  // TODO: Make a date personalized input to check inputs.dsabnffdsbfshsadfbfdsa
  function onChange(e) {
    setArtistState({ ...artistState, [e.target.name]: e.target.value });
  }
  useEffect(() => {
    const {
      images = [],
      description = '',
      networks = {},
      name,
      dateOfBirth = '2019/09/31',
    } = artist;
    setArtistState({
      description,
      networks,
      images,
      name,
      dateOfBirth,
    });
  }, [artist]);
  return (
    <div>
      <div className="m-3">
        <h2>{`${name} new suggestion!`}</h2>
      </div>
      <form className="container">
        <InputBorderline
          type="text"
          name="description"
          label="Description"
          value={artistState.description}
          onChange={onChange}
          multiline
        />
        <InputBorderline
          type="date"
          name="dateOfBirth"
          label=""
          value={artistState.dateOfBirth}
          onChange={onChange}
          multiline={false}
        />
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
  artist: state.artist.artistForm,
});

export default connect(
  mapStateToProps,
  {},
)(ArtistForm);
