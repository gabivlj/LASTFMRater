/* eslint-disable prettier/prettier */
import React from 'react';
import { connect } from 'react-redux';

function Suggestion({ tag, data }) {
  const dataShow =
    typeof data === 'object' ? JSON.stringify(data, null, 4) : data;
  console.log(dataShow);
  return (
    <div
      style={{
        whiteSpace: 'pre-wrap',
        margin: '0 0 0 10%',
      }}
    >
      <div style={{ padding: '3%', border: '1px solid black' }}>
        {`${tag}: `} 
{' '}
{dataShow}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Suggestion);
