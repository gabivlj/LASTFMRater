import React, { useEffect } from 'react';
import Gramp from './Gramp';

function Timeline({ loadGramps, gramps }) {
  useEffect(() => {
    loadGramps();
  }, []);
  return (
    <div>
      <h1>Timeline lmao</h1>
      <div className="row">
        <div className="col-md-4">-</div>
        <div className="gramp-container col-sm-12 col-md-8">
          {gramps.map(gramp => (
            <Gramp gramp={gramp} key={gramp._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timeline;
