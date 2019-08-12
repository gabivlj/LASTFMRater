const initialState = {
  chats: null,
  chat: null,
  currentChatUsername: 'gabivlj4',
  currentChatInfo: null,
  open: false
};

// page: (chat list : 'mutual list') = > enterchat => SET_CHAT_USER => _chat_
export default (state = initialState, action) => {
  switch (action.type) {
    case 'OPEN':
      return {
        ...state,
        open: !state.open
      };
    case 'SET_CHAT_INFO':
      return {
        ...state,
        currentChatInfo: action.payload
      };
    case 'SET_CHAT':
      return {
        ...state,
        currentChatUsername: action.payload
      };
    case 'GET_CHAT':
      return {
        ...state,
        chat: action.payload
      };
    case 'SEND_MESSAGE':
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, action.payload]
        }
      };
    // THIS IS FOR THE CURRENT CHAT...
    case 'RECEIVE_MESSAGE':
      if (!state.chat || !state.chat.users[action.payload.from]) {
        return { ...state };
      }

      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [
            ...(state.chat ? state.chat.messages : []),
            action.payload.chat
          ]
        }
      };
    case 'LEAVE_CHAT':
      return {
        ...state,
        chat: null
      };
    default:
      return {
        ...state
      };
  }
};
