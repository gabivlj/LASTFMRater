import React, { useEffect } from 'react';
import Gramp from './Gramp';

function Timeline({ loadGramps, gramps }) {
  useEffect(() => {
    loadGramps();
  }, []);
  return (
    <div>
      <h1>Timeline lmao</h1>
      <div className="container gramp-container">
        {gramps.map(gramp => (
          <Gramp gramp={gramp} _id={gramp._id} />
        ))}
      </div>
    </div>
  );
}

export default Timeline;
