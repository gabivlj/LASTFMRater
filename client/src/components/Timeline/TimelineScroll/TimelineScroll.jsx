import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import ScrollerLoader from '../../Common/ScrollerLoader';
import {
  loadGrampsOwnTimeline,
  cleanGrampsProfile,
} from '../../../actions/timelineActions';
import Gramp from '../Gramp';
import { setCommentOverlay } from '../../../actions/commentActions';

function TimelineScroll({
  timeline,
  id,
  loadGrampsOwnTimeline,
  setCommentOverlay,
  cleanGrampsProfile,
}) {
  const ADDER_N_GRAMPS = 25;
  const TIMEOUT = 1000;
  let timeoutForLoading = false;
  let timeoutForLoadingBottom = false;
  let nGramps = ADDER_N_GRAMPS;
  console.log(id);
  useEffect(() => {
    timeoutForLoading = false;
    timeoutForLoadingBottom = false;
    nGramps = ADDER_N_GRAMPS;
    cleanGrampsProfile();
    return () => cleanGrampsProfile();
  }, [id]);

  function checkTop(preload) {
    // asds
    if ((timeline.loaded && !timeoutForLoading) || preload) {
      setTimeout(() => {
        timeoutForLoading = false;
      }, TIMEOUT);
      // Update.
      loadGrampsOwnTimeline(id, 0, nGramps - 1, true);
      timeoutForLoading = true;
    }
  }

  function checkBottom(preload) {
    if (preload) return;
    if (timeline.loaded && !timeoutForLoadingBottom) {
      console.log(nGramps, ADDER_N_GRAMPS);
      loadGrampsOwnTimeline(id, nGramps, nGramps + ADDER_N_GRAMPS - 1, false);
      nGramps += ADDER_N_GRAMPS;
      setTimeout(() => {
        timeoutForLoadingBottom = false;
      }, TIMEOUT);
      timeoutForLoadingBottom = true;
    }
  }
  // function whenBottom() {
  //   getGr;
  // }
  return (
    <div>
      <h1>Timeline scroller</h1>
      <ScrollerLoader
        actionWhenBottom={checkBottom}
        actionWhenTop={checkTop}
        uuid="Timeliner"
        preload
        style={{ maxHeight: '500px', width: '100%', minHeight: '200px' }}
      >
        {!timeline.loaded && timeline.restartTimelineProfile ? (
          <LinearProgress style={{ width: '100%', marginTop: '5px' }} />
        ) : null}
        {timeline.grampsProfile.map(gramp => (
          <Gramp gramp={gramp} key={gramp._id} onClick={setCommentOverlay} />
        ))}
        {!timeline.loaded && timeline.grampsProfile.length ? (
          <LinearProgress style={{ width: '100%' }} />
        ) : null}
      </ScrollerLoader>
    </div>
  );
}

const MSTP = state => ({
  timeline: state.timeline,
});

export default connect(
  MSTP,
  { loadGrampsOwnTimeline, setCommentOverlay, cleanGrampsProfile },
)(TimelineScroll);
