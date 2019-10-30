import jwt from 'jwt-decode';
import { axiosAPI } from './axios';
import API from '../API';

// Function that handles await async errors, handles the promise that you pass.
export const handleError = fn =>
  fn.then(data => [null, data]).catch(error => [error]);

export function setAuthTokenLocalStorage(token) {
  localStorage.setItem('token', token);
}

export function LogUser(token) {
  const user = jwt(token);
  return user;
}

export function setAuthTokenAxios(token) {
  axiosAPI.defaults.headers.common.Authorization = token;
  axiosAPI.defaults.headers.common.CLIENT_KEY =
    process.env.CLIENT_KEY || API.CLIENT_KEY;
}

export function deleteAuthTokenAxios() {
  delete axiosAPI.defaults.headers.common.Authorization;
}

export function deleteAuthTokenFromLS() {
  localStorage.removeItem('token');
}

class Auth {
  constructor() {
    this.currentAuthToken = null;
    this.proxy = 'http://localhost:8000';
  }

  static LogOut() {
    deleteAuthTokenAxios();
    deleteAuthTokenFromLS();
  }

  /**
   * @param {String, String: email, password} param0
   */
  static async LogUserFromLogin({ email, password }) {
    const [error, authResponse] = await handleError(
      axiosAPI.post(`/user/auth/login`, { email, password }),
    );

    if (error) {
      return { error: error.response.data };
    }
    const { token, success } = authResponse.data;
    setAuthTokenAxios(token);
    setAuthTokenLocalStorage(token);
    return LogUser(token);
  }

  // Not used method.
  static async IsUserLoged() {
    const [error, data] = await handleError(axiosAPI.get('/user/loged'));
    if (error) {
      return false;
    }

    return true;
  }

  static LogUser(token) {
    const user = jwt(token);
    return user;
  }

  static LogUserFromLS() {
    const token = localStorage.getItem('token');
    // For some reason, the guys who decided that when a token doesn't exist it returns a string set to "undefined", not null or undefined ????????????????????? ...
    if (!token || token === undefined || /* LOL */ token === 'undefined') {
      return null;
    }
    const user = jwt(token);
    if (user.exp < Date.now() / 1000) return null;
    setAuthTokenAxios(token);
    return user;
  }
}

export default Auth;
