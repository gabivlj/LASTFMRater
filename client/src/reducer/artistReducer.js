const initialState = {
  artist: {},
  albums: null,
  artistForm: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ARTIST_ALBUMS':
      return {
        ...state,
        albums: action.payload ? action.payload.topalbums : null,
      };
    case 'SET_ARTIST':
      return {
        ...state,
        artist: action.payload ? action.payload : null,
      };
    case 'SET_ARTIST_FORM':
      return {
        ...state,
        artistForm: action.payload,
      };
    case 'CLEAN_ARTIST_FORM':
      return {
        ...state,
        artistForm: {},
      };
    default:
      return state;
  }
};
