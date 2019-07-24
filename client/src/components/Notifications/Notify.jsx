import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Notification from './Notification';
import { cleanNotify } from '../../actions/notifyActions';

function Notify({ notify, cleanNotify }) {
  const { notification } = notify;
  return (
    <div>
      <Notification
        variant={notification.variant || 'success'}
        message={notification.message || ''}
        autoHideDuration={notification.autoHideDuration || '3000'}
        closeNotification={() => cleanNotify()}
        isOpen={notification.showing}
      />
    </div>
  );
}

Notify.propTypes = {
  notify: PropTypes.object.isRequired,
  cleanNotify: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  notify: state.notify
});

export default connect(
  mapStateToProps,
  {
    cleanNotify
  }
)(Notify);
