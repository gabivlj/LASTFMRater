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
            __v: action.payload.__v,
            ratings: action.payload.ratings,
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
          }
        }
      }
    case 'LIKE_COMMENT_ALBUM':
      return {
        ...state,
        album: {
          album: {
            ...state.album.album,
            comments: [...action.payload.comments],                        
          }
        }
      }
    case 'CLEAR_ALBUM':
      return {
        album: null,
        albumDB: null,
      };
    default:
      return state;
  }
};
