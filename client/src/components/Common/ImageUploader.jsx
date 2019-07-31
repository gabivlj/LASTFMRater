import React from 'react';

function ImageUploader({ submit }) {
  const [file, changeFile] = React.useState(null);
  function onSubmit(e) {
    e.preventDefault();
    if (!file) return;
    submit(file);
  }
  return (
    <form onSubmit={onSubmit}>
      <input
        type="file"
        name="grumpy-file"
        onChange={e => changeFile(e.target.files[0])}
      />
      <input type="submit" value="Send" className="btn btn-primary" />
    </form>
  );
}

export default ImageUploader;
