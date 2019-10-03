import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import {
  getReviewEditor,
  cleanReviewEditor,
} from '../../../actions/reviewActions';

function Editor({ reviewID, review, getReviewEditor, cleanReviewEditor }) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (reviewID !== review._id) {
      getReviewEditor(reviewID);
    } else {
      setText(review.text);
    }
  }, [reviewID, review._id]);
  useEffect(() => {
    return () => {
      cleanReviewEditor();
    };
  }, []);
  return (
    <div>
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
    </div>
  );
}

const mapStateToProps = state => ({
  review: state.review.editReview,
});

export default connect(
  mapStateToProps,
  { getReviewEditor, cleanReviewEditor },
)(Editor);
