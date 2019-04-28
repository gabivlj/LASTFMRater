/**
 * !
 * We are gonna refactor later the profile to this reducer, like ratings and stuff. We're gonna start with !
 * ! the playlists and then more stuff like followers for more code clarity
 * !
 */

const initialState = {
  playlists: null,
  isLoadingPlaylists: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PLAYLISTS_PROFILE':
      return {
        ...state,
        playlists: action.payload,
        isLoadingPlaylists: false
      };
    case 'LOADING_PLAYLISTS_PROFILE':
      return {
        ...state,
        isLoadingPlaylists: true
      }
    default:
      return {
        ...state,
      }
  }
}