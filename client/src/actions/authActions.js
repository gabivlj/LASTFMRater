import axios from 'axios';

import User from '../classes/User';
import Auth, {
	handleError,
	deleteAuthTokenAxios,
	deleteAuthTokenFromLS
} from '../utils/Auth';

/**
 * @description This action is called when lastfm auth is done.
 */
export const setUser = (
	token,
	username,
	history = null,
	typeoflogin = null
) => async dispatch => {
	axios
		.post(`/api/user/${token}`, { username })
		.then(async res => {
			history.push('/auth/login');
			const user = new User(res.data);
			const apiUser = await axios.post(`/api/user/lastfm/${username}`, user);
			deleteAuthTokenFromLS();
			dispatch(logOut());
		})
		.catch(err => console.log(err));
};

export const logFromSession = () => dispatch => {
	const user = Auth.LogUserFromLS();
	if (!user) return;
	if (user.exp < Date.now() / 1000) {
		return;
	}
	dispatch({
		type: 'SET_API_USER',
		payload: user
	});

	// axios.get('/api/user/info').then(res => {
	//   dispatch({
	//     type: 'SET_API_USER',
	//     payload: res.data
	//   })
	// }).catch(err => console.log(err))
};

export const logIn = user_ => async dispatch => {
	const user = await Auth.LogUserFromLogin(user_);
	if (user.error) {
		// dispatch error
		dispatch({
			type: 'SET_ERRORS_LOGIN',
			payload: user.error.errors
		});
		return;
	}
	dispatch({
		type: 'SET_API_USER',
		payload: user
	});
};

export const logOut = () => dispatch => {
	Auth.LogOut();
	dispatch({
		type: 'SET_API_USER',
		payload: {}
	});
};

export const getUser = () => async dispatch => {
	const [error, user] = await handleError(axios.get('/api/user/info'));
	if (error) return;
	dispatch({
		type: 'SET_API_USER',
		payload: user.data
	});
};

export const register = (
	email,
	password,
	password2,
	username,
	history
) => async dispatch => {
	const [error, userRegister] = await handleError(
		axios.post('/api/user/auth/register', {
			email,
			password,
			password2,
			username
		})
	);
	if (!error) {
		history.push('/auth/login');
		return;
	} // dispatch errors
	console.log(error);
	dispatch({
		type: 'SET_ERRORS_REGISTER',
		payload: error.response.data
	});
};

/**
 * @description Get the artists that the user listens to in Lastfm.
 */

export const setUsersArtists = name => dispatch => {
	if (name)
		axios
			.get(`/api/user/artists/${name}`)
			.then(res => {
				dispatch({
					type: 'SET_USER_ARTISTS',
					payload: res.data
				});
			})
			.catch(err => console.log(err.response.data));
};
