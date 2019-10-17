import React from 'react';
import './image-uploader.style.css';
import { Chip } from '@material-ui/core';

function ImageUploader({ submit }) {
  const [file, changeFile] = React.useState(null);
  const [error, setError] = React.useState('');
  function onSubmit(e) {
    e.preventDefault();
    if (!file) return;
    submit(file);
  }
  const FILE_EXTENSIONS = {
    'image/gif': true,
    'image/jpeg': true,
    'image/png': true,
  };
  function changeFileOnChange(e) {
    const { files } = e.target;
    if (files.length <= 0) {
      changeFile(null);
      return;
    }
    if (files.length > 1) {
      changeFile(null);
      return;
    }
    const [file] = files;
    if (!FILE_EXTENSIONS[file.type]) {
      changeFile(null);
      setError(`File is not an image! Try another file`);
      return;
    }
    changeFile(file);
  }
  const renderError = error !== '' && (
    <Chip
      // icon=<FaceIcon />}
      label={error}
      onDelete={() => setError('')}
      className="p-2 mr-3 mt-3 mb-3"
      color="secondary"
    />
  );
  return (
    <form onSubmit={onSubmit}>
      {renderError}
      <input
        type="file"
        id="grumpy-file"
        name="grumpy-file"
        className="grumpy-file"
        onChange={changeFileOnChange}
      />
      <label
        htmlFor="grampy-file"
        nesting=""
        id="grumpy-file"
        className="input-grumpy"
      >
        <i className="fa fa-cloud-upload-alt pl-3 pr-3" aria-hidden="true" />
      </label>
      <br />

      {!!file && (
        <input
          type="submit"
          value="Upload image"
          className="btn btn-primary mt-1"
        />
      )}
    </form>
  );
}

export default ImageUploader;
