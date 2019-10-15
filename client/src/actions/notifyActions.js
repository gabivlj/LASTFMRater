import {
  NOTIFY_SUCCESS,
  NOTIFY_NORMALITY,
  NOTIFY_ERROR,
  NOTIFY_CLEAN,
} from './types';

export const notifySuccess = (message, autoHideDuration = 1000) => ({
  type: NOTIFY_SUCCESS,
  payload: {
    message,
    autoHideDuration,
  },
});

export const notifyNormality = (message, autoHideDuration = 1000) => ({
  type: NOTIFY_NORMALITY,
  payload: {
    message,
    autoHideDuration,
  },
});

export const notifyError = (message, autoHideDuration = 1000) => ({
  type: NOTIFY_ERROR,
  payload: {
    message,
    autoHideDuration,
  },
});

export const cleanNotify = () => dispatch => {
  return dispatch({
    type: NOTIFY_CLEAN,
  });
};
