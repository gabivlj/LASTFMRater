import uuid from 'uuid/v1';
import Axios from 'axios';
import handleError from './handleError';
import linksHttp from './links.http';

export default async file => {
  const fileData = new FormData();
  fileData.append('grumpy-file', file, uuid());
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  const [res, error] = await handleError(
    Axios.post(`${linksHttp.GO_IMAGE}/api/image`, fileData, config),
  );
  return [res, error];
};
