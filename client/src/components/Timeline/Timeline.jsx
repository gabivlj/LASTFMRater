import React, { useEffect } from 'react';
import { LinearProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import Gramp from './Gramp';

function Timeline({ loadGramps, gramps, loaded, updateOnScroll }) {
  let timeoutForLoading = false;
  useEffect(() => {
    let checkTop;
    if (updateOnScroll) {
      checkTop = () => {
        if (window.scrollY <= 0 && loaded && !timeoutForLoading) {
          setTimeout(() => {
            timeoutForLoading = false;
          }, 1000);
          // Update.
          loadGramps();
          timeoutForLoading = true;
          // API Call.
        }
      };
      document.addEventListener('scroll', checkTop);
    }
    loadGramps();
    return () => {
      if (updateOnScroll) document.removeEventListener('scroll', checkTop);
    };
  }, []);
  return (
    <div>
      {loaded ? null : <LinearProgress />}
      <div className="row">
        <div className="col-md-4">...</div>
        <div className="gramp-container col-sm-12 col-md-8">
          {gramps.map(gramp => (
            <Gramp gramp={gramp} key={gramp._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

Timeline.propTypes = {
  loadGramps: PropTypes.func.isRequired,
  gramps: PropTypes.array.isRequired,
  loaded: PropTypes.bool.isRequired,
  updateOnScroll: PropTypes.bool
};

Timeline.defaultProps = {
  updateOnScroll: true
};

export default Timeline;
