/**
 * !
 * We are gonna refactor later the profile to this reducer, like ratings and stuff. We're gonna start with !
 * ! the playlists and then more stuff like followers for more code clarity
 * !
 */

const initialState = {
  playlists: null,
  isLoadingPlaylists: false,
  profile: null,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PLAYLISTS_PROFILE':
      return {
        ...state,
        playlists: action.payload,
        isLoadingPlaylists: false
      };
    case 'GET_PROFILE_FULL':
      return {
        ...state,
        profile: action.payload.profile
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload
        }
      };
    case 'ERROR_GETTING_PROFILE':
      return {
        ...state,
        error: action.payload
      };
    case 'CLEAN_ERRORS':
      return {
        ...state,
        error: null
      };
    case 'LOADING_PLAYLISTS_PROFILE':
      return {
        ...state,
        isLoadingPlaylists: true
      };
    default:
      return {
        ...state
      };
  }
};
