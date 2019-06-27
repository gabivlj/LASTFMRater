const initialState = {
	comments: [],
	loaded: true
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'SET_COMMENTS':
			return {
				...state,
				comments: [...action.payload],
				loaded: true
			};
		case 'REPLACE_COMMENT':
			return {
				...state,
				comments: [
					...state.comments.slice(0, action.payload.index),
					action.payload.comment,
					...state.comments.slice(
						action.payload.index + 1,
						state.comments.length
					)
				]
			};
		case 'ADD_COMMENT':
			return {
				...state,
				comments: [action.payload, ...state.comments],
				loaded: true
			};
		case 'SET_LOADING_COMMENTS':
			return {
				...state,
				loaded: !state.loaded
			};
		default: 
			return {
				...state
			}
	}
};
