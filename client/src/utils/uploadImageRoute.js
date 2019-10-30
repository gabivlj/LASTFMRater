import handleError from './handleError';
import { notifySuccess } from '../actions/notifyActions';
import { axiosAPI } from './axios';

/**
 * @param {String}, Route that we wanna call post to.
 * @param {Function}, Dispatch method
 * @param {Callback}, Callback that it's passed the images array.
 * @param {Object}, Lg, md, lz, sm strings.
 * @param {String?}, Success message
 * @param {String?}, Error message
 * @description Uploads to the Node.js server the specified image routes.
 * @returns {dispatchCallback} The dispatchCallback
 */
export default async (
  route,
  dispatch,
  dispatchCallback,
  { lg, md, lz, sm },
  msgSuccess = 'Image uploaded succesfuly!',
  msgError = 'Error uploading image!',
) => {
  const [final, err] = await handleError(
    axiosAPI.post(route, { lz, md, lg, sm }),
  );
  if (err) return dispatch(notifySuccess(msgError, 2000));
  dispatch(notifySuccess(msgSuccess, 2000));
  return dispatchCallback(final.data.images);
};
