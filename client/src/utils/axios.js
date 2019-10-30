import Axios from 'axios';
import linksHttp from './links.http';

export const axiosAPI = Axios.create({ baseURL: linksHttp.API });
export const axiosImage = Axios.create({
  baseURL: `${linksHttp.GO_IMAGE}/api`,
});
export const axiosChat = Axios.create({ baseURL: linksHttp.GO_CHAT });
export const axiosFM = Axios.create({
  baseURL: 'http://ws.audioscrobbler.com/2.0',
});
