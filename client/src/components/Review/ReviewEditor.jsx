import React, { useState, useEffect } from 'react';
import './review-editor.style.css';

import { withRouter } from 'react-router-dom';
import Editor from './Editor/Editor';

function ReviewEditor({ match }) {
  const { id } = match.params;
  return <Editor reviewID={id} />;
}

export default withRouter(ReviewEditor);
