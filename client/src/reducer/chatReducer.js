const initialState = {
  chats: null,
  chat: null,
  currentChatUsername: 'gabivlj4',
  currentChatInfo: null,
  open: false,
  route: 'CHATS',
  friendsConnected: null,
  notification: false
};

// page: (chat list : 'mutual list') = > enterchat => SET_CHAT_USER => _chat_
export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notification: action.payload
      };
    case 'SET_FRIENDS_CONNECTED':
      return {
        ...state,
        friendsConnected: action.payload
      };
    case 'SET_FRIEND_CONNECTION':
      return {
        ...state,
        friendsConnected: {
          ...state.friendsConnected,
          [action.payload.user]: action.payload.connected
        }
      };
    case 'SET_CHATS':
      return {
        ...state,
        chats: action.payload
      };
    case 'OPEN':
      return {
        ...state,
        open: !state.open
      };
    case 'SET_CHAT_ROUTE':
      return {
        ...state,
        route: action.payload
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
