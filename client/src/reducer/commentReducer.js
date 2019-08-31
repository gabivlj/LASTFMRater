const initialState = {
  comments: [],
  showCommentOverlay: false,
  loaded: true,
  comment: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'COMMENTS_OVERLAY':
      return {
        ...state,
        commentsOverlay: action.payload,
      };
    case 'SET_COMMENT_OVERLAY':
      return {
        ...state,
        comment: action.payload,
      };
    case 'SHOW_OVERLAY':
      return {
        ...state,
        showCommentOverlay: action.payload,
      };
    case 'SET_COMMENTS':
      return {
        ...state,
        comments: [...action.payload],
        loaded: true,
      };
    case 'ADD_COMMENTS':
      return {
        ...state,
        comments: [...state.comments, ...action.payload],
        loaded: true,
      };
    case 'REPLACE_COMMENT':
      return {
        ...state,
        comments: [
          ...state.comments.slice(0, action.payload.index),
          action.payload.comment,
          ...state.comments.slice(
            action.payload.index + 1,
            state.comments.length,
          ),
        ],
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [action.payload, ...state.comments],
        loaded: true,
      };
    case 'SET_LOADING_COMMENTS':
      return {
        ...state,
        loaded: !state.loaded,
      };
    default:
      return {
        ...state,
      };
  }
};
