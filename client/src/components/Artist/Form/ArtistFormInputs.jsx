import React from 'react';
import { Button } from '@material-ui/core';
import InputBorderline from '../../Common/InputBorderline';
import ImageUploader from '../../Common/ImageUploader';

function ArtistFormInputs({
  artistState,
  onChange,
  setNetwork,
  addGenre,
  addImage,
  changedState,
  reset,
  submit,
}) {
  return (
    <div>
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
        {/* TODO: Put here the networks input. When on change an input call setNetwork */}
        {/* <NetworksInput setNetwork={setNetwork} networks={artistState.networks} /> */}
        <h3>Add image</h3>
        <ImageUploader submit={addImage} />
        {/* TODO: Put here MultipleInput. That you can write something enter it and add it to an array. */}
        {/** <MultipleInput onSubmit={addGenre} elements={artistState.genres} /> */}
        {Object.keys(changedState).length !== 0 && (
          <div>
            <Button
              className="m-3"
              color="primary"
              variant="contained"
              onClick={submit}
            >
              Propose changes
            </Button>
            <Button
              className="m-3"
              color="primary"
              variant="contained"
              onClick={reset}
            >
              Reset changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default ArtistFormInputs;
