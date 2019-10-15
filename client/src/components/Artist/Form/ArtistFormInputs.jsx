import React from 'react';
import { Button } from '@material-ui/core';
import InputBorderline from '../../Common/InputBorderline';

function ArtistFormInputs({
  artistState,
  onChange,
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
