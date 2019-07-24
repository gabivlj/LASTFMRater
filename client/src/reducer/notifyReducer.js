import {
  NOTIFY_SUCCESS,
  NOTIFY_NORMALITY,
  NOTIFY_ERROR,
  NOTIFY_CLEAN
} from '../actions/types';

const initialState = {
  notification: {
    showing: false,
    message: '',
    variant: '',
    autoHideDuration: 0
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NOTIFY_SUCCESS:
      return {
        ...state,
        notification: {
          ...action.payload,
          variant: 'success',
          showing: true
        }
      };
    case NOTIFY_NORMALITY:
      return {
        ...state,
        notification: {
          ...action.payload,
          variant: 'info',
          showing: true
        }
      };
    case NOTIFY_ERROR:
      return {
        ...state,
        notification: {
          ...action.payload,
          variant: 'error',
          showing: true
        }
      };
    case NOTIFY_CLEAN:
      return {
        ...state,
        notification: {
          ...state.notification,
          showing: false
        }
      };
    default:
      return {
        ...state
      };
  }
};
