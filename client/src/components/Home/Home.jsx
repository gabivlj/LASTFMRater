import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import KEYS from '../../API';
import logo from '../../images/grampy-logo.png';
import Timeline from '../Timeline/Timeline';
import { loadGramps } from '../../actions/timelineActions';
import { setCommentOverlay } from '../../actions/commentActions';

function Home({ auth, loadGramps, timeline, setCommentOverlay }) {
  const render = auth ? (
    <Timeline
      loadGramps={loadGramps}
      gramps={timeline.gramps}
      loaded={timeline.loaded}
      onClickGramp={setCommentOverlay}
    />
  ) : (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p style={{ color: '#ff0000' }}>
          Rate the music that you listen! Make reviews and check what is the
          community rating of your favorite album or playlist!
        </p>
        <Link
          className="App-link"
          to="/auth/login"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#b0131e' }}
        >
          Log into your profile
        </Link>
        <Link
          className="App-link"
          to="/auth/register"
          target="_blank"
          style={{ color: '#b0131e' }}
        >
          Register!
        </Link>
      </header>
    </div>
  );
  return render;
}

const mapStateToProps = state => ({
  auth: state.auth.auth,
  timeline: state.timeline,
});
export default connect(
  mapStateToProps,
  { loadGramps, setCommentOverlay },
)(Home);
