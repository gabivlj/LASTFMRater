import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './review-editor.style.css';
import { Button } from '@material-ui/core';

function ReviewEditor() {
  const [text, setText] = useState('');

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h2>Review editor:</h2>
          <div className="editor">
            <textarea
              name="text"
              id=""
              cols="30"
              rows="10"
              onChange={e => setText(e.target.value)}
              value={text}
            />
            <Button color="primary" variant="contained" component="span">
              Submit
            </Button>
            <Button color="primary" className="ml-2" component="span">
              Save
            </Button>
          </div>
        </div>
        <div className="col-md-6">
          <h2>Preview: </h2>
          <ReactMarkdown source={text} skipHtml />
        </div>
      </div>
    </div>
  );
}

export default ReviewEditor;
