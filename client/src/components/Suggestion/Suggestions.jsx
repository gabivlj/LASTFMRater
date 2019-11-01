import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import Suggestion from './Suggestion';
import { getSuggestions } from '../../actions/suggestionActions';

function Suggestions({ match, getSuggestions, suggestion, history }) {
  console.log(match);
  const { type, id } = match.params;
  const { loading, suggestions } = suggestion;

  useEffect(() => {
    getSuggestions(type, id, history);
  }, []);

  return (
    <div>
      <div>{loading ? <LinearProgress /> : null}</div>
      {suggestions.map(suggestion => (
        <Suggestion
          suggestion={suggestion}
          disabled={false}
          key={suggestion._id}
        />
      ))}
    </div>
  );
}

const mapStateToProps = state => ({
  suggestion: state.suggestions,
});

// todo: Store and api calls
export default connect(
  mapStateToProps,
  { getSuggestions },
)(withRouter(Suggestions));
