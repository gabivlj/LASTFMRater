import filterOne from '../utils/filterOne';

const initialState = {
  chats: null,
  chat: null,
  currentChatUsername: 'gabivlj4',
  currentChatInfo: null,
  open: false,
  route: 'CHATS',
  friendsConnected: null,
  listOfFriends: [],
  notification: false,
  isLoading: false,
  totalNotifications: 0,
};

// page: (chat list : 'mutual list') = > enterchat => SET_CHAT_USER => _chat_
export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TOTAL_NOTIFICATIONS':
      return {
        ...state,
        totalNotifications: action.payload,
      };
    // maybe ?
    case 'SUBSTRACT_TOTAL_NOTIFICATIONS':
      return {
        ...state,
        totalNotifications: state.totalNotifications - action.payload,
      };
    case 'ADD_TOTAL_NOTIFICATIONS':
      return {
        ...state,
        totalNotifications: state.totalNotifications + action.payload,
      };
    case 'SET_FRIENDS':
      return {
        ...state,
        listOfFriends: [...action.payload],
      };
    case 'SET_LOADING_CHAT':
      return {
        ...state,
        isLoading: !state.isLoading,
      };
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notification: action.payload,
      };
    case 'SET_FRIENDS_CONNECTED':
      return {
        ...state,
        friendsConnected: action.payload,
      };
    case 'SET_FRIEND_CONNECTION':
      return {
        ...state,
        friendsConnected: {
          ...state.friendsConnected,
          [action.payload.user]: action.payload.connected,
        },
      };
    case 'SET_CHATS':
      return {
        ...state,
        chats: action.payload,
      };
    case 'OPEN':
      return {
        ...state,
        open: !state.open,
      };
    case 'SET_CHAT_ROUTE':
      return {
        ...state,
        route: action.payload,
      };
    case 'SET_CHAT_INFO':
      return {
        ...state,
        currentChatInfo: action.payload,
      };
    case 'SET_CHAT':
      return {
        ...state,
        currentChatUsername: action.payload,
      };
    case 'TEMPORARY_MESSAGE':
      return {
        ...state,
        chat: {
          ...state.chat,
          tempMessages: [...state.chat.tempMessages, action.payload],
        },
      };
    case 'CLEAN_TEMPORARY_MESSAGE':
      return {
        ...state,
        chat: {
          ...state.chat,
          tempMessages: filterOne(state.chat.tempMessages, (element, index) => {
            console.log(action.payload);
            return (
              element.username === action.payload.username &&
              element.text === action.payload.text
            );
          }),
        },
      };
    case 'GET_CHAT':
      return {
        ...state,
        chat: { ...action.payload, tempMessages: [] },
      };
    case 'SEND_MESSAGE':
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, action.payload],
        },
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
            action.payload.chat,
          ],
        },
      };
    case 'UPDATE_CHAT_LIST':
      if (!state.chats) return { ...state };

      return {
        ...state,
        chats: [
          ...state.chats.reduce(
            (prev, chat) =>
              chat.otherUser === action.payload.user &&
              chat.lastPerson &&
              String(chat.lastPerson.user) === action.payload.user
                ? [
                    {
                      ...chat,
                      messages: [action.payload.message],
                      lastPerson: {
                        notification: chat.lastPerson.notification + 1,
                        user: action.payload.user,
                      },
                      date: Date.now(),
                    },
                    ...prev,
                  ]
                : [...prev, chat],
            [],
          ),
        ],
      };
    case 'LEAVE_CHAT':
      return {
        ...state,
        chat: null,
      };
    default:
      return {
        ...state,
      };
  }
};
