import Axios from 'axios';
import linksHttp from './links.http';

export const axiosAPI = Axios.create({ baseURL: linksHttp.API });
axiosAPI
  .get('/test')
  .then(e => console.log(e))
  .catch(e => console.log(e));
export const axiosImage = Axios.create({
  baseURL: `${linksHttp.GO_IMAGE}/api`,
});
export const axiosChat = Axios.create({ baseURL: linksHttp.GO_CHAT });
export const axiosFM = Axios.create({
  baseURL: 'http://ws.audioscrobbler.com/2.0',
});
