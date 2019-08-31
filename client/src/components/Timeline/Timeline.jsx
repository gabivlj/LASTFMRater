import React, { useEffect, useState } from 'react';
import { LinearProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import Gramp from './Gramp';

function Timeline({
  loadGramps,
  gramps,
  loaded,
  updateOnScrollBot,
  updateOnScrollTop,
  onClickGramp,
}) {
  // let timeoutForLoading = false;
  const ADDER_N_GRAMPS = 10;
  const TIMEOUT = 1000;

  let timeoutForLoading = false;
  let timeoutForLoadingBottom = false;
  let nGramps = ADDER_N_GRAMPS;

  useEffect(() => {
    function checkTop() {
      if (window.scrollY <= 0 && loaded && !timeoutForLoading) {
        setTimeout(() => {
          timeoutForLoading = false;
        }, TIMEOUT);
        // Update.
        loadGramps(0, nGramps - 1, true);
        timeoutForLoading = true;
      }
    }

    function checkBottom() {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        loaded &&
        !timeoutForLoadingBottom
      ) {
        loadGramps(nGramps, nGramps + ADDER_N_GRAMPS - 1, false);
        nGramps += ADDER_N_GRAMPS;
        setTimeout(() => {
          timeoutForLoadingBottom = false;
        }, TIMEOUT);
        timeoutForLoadingBottom = true;
      }
    }

    if (updateOnScrollTop) document.addEventListener('scroll', checkTop);
    if (updateOnScrollBot) document.addEventListener('scroll', checkBottom);

    return () => {
      if (updateOnScrollTop) document.removeEventListener('scroll', checkTop);
      if (updateOnScrollBot)
        document.removeEventListener('scroll', checkBottom);
    };
  }, [updateOnScrollTop, updateOnScrollBot]);

  useEffect(() => {
    loadGramps(0, ADDER_N_GRAMPS - 1);
  }, []);

  return (
    <div style={{ paddingBottom: '300px' }}>
      {loaded ? null : <LinearProgress />}
      <div className="row">
        <div className="col-md-4">...</div>
        <div className="gramp-container col-sm-12 col-md-8">
          {gramps.map(gramp => (
            <Gramp gramp={gramp} key={gramp._id} onClick={onClickGramp} />
          ))}
        </div>
      </div>
      {loaded ? null : <LinearProgress />}
    </div>
  );
}

Timeline.propTypes = {
  loadGramps: PropTypes.func.isRequired,
  gramps: PropTypes.array.isRequired,
  loaded: PropTypes.bool.isRequired,
  updateOnScrollBot: PropTypes.bool,
  updateOnScrollTop: PropTypes.bool,
};

Timeline.defaultProps = {
  updateOnScrollTop: true,
  updateOnScrollBot: true,
};

export default Timeline;
