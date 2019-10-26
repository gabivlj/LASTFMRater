const initialState = {
  comments: [],
  commentsOverlay: [],
  commentsCache: [],
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
    case 'CLOSE_OVERLAY':
      return {
        ...state,
        comment: {},
        commentsOverlay: [],
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
        comments: [
          ...(state.showCommentOverlay ? state.comments : action.payload),
        ],
        commentsOverlay: [
          ...(state.showCommentOverlay
            ? action.payload
            : state.commentsOverlay),
        ],
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
        comments: state.showCommentOverlay
          ? state.comments
          : [
              ...state.comments.slice(0, action.payload.index),
              action.payload.comment,
              ...state.comments.slice(
                action.payload.index + 1,
                state.comments.length,
              ),
            ],
        commentsOverlay: !state.showCommentOverlay
          ? state.commentsOverlay
          : [
              ...state.commentsOverlay.slice(0, action.payload.index),
              action.payload.comment,
              ...state.commentsOverlay.slice(
                action.payload.index + 1,
                state.commentsOverlay.length,
              ),
            ],
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        comments: state.showCommentOverlay
          ? state.comments
          : [action.payload, ...state.comments],
        commentsOverlay: state.showCommentOverlay
          ? [action.payload, ...state.commentsOverlay]
          : state.commentsOverlay,
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
