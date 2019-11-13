const initialState = {
  album: null,
  albumDB: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALBUM':
      return {
        ...state,
        album: action.payload,
      };
    case 'ADD_ALBUM':
      return {
        ...state,
        album: {
          album: {
            ...state.album.album,
            ...action.payload,
            __v: action.payload.__v,
          },
        },
      };
    case 'ADD_COMMENT_ALBUM':
      return {
        ...state,
        album: {
          album: {
            ...state.album.album,
            comments: [...action.payload.comments],
          },
        },
      };
    case 'LIKE_COMMENT_ALBUM':
      return {
        ...state,
        album: {
          album: {
            ...state.album.album,
            comments: [...action.payload.comments],
          },
        },
      };
    case 'CLEAR_ALBUM':
      return {
        album: null,
        albumDB: null,
      };
    case 'UPDATE_ALBUM':
      return {
        ...state,
        album: {
          album: {
            ...state.album.album,
            ...action.payload,
          },
        },
      };
    default:
      return state;
  }
};
