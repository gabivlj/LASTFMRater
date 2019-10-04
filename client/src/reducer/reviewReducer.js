const initialState = {
  review: {},
  editReview: {},
  reviews: [],
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_REVIEW_EDITOR':
      return {
        ...state,
        editReview: action.payload,
        loading: false,
      };
    case 'CLEAN_REVIEW_EDIT':
      return {
        ...state,
        editReview: {},
      };
    case 'SET_LOADING_REVIEW':
      return {
        ...state,
        loading: true,
      };
    case 'SET_REVIEW':
      return {
        ...state,
        review: action.payload,
        loading: false,
      };
    case 'CLEAN_REVIEW':
      return {
        ...state,
        review: {},
      };
    case 'SET_REVIEWS':
      return {
        ...state,
        reviews: [...action.payload],
        loading: false,
      };
    case 'ADD_REVIEWS':
      return {
        ...state,
        reviews: [...state.reviews, ...action.payload],
        loading: false,
      };
    case 'CLEAN_REVIEWS':
      return {
        ...state,
        reviews: [],
      };
    default:
      return {
        ...state,
      };
  }
};
