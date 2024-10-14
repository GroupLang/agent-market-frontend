import {
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_CONVERSATIONS_SUCCESS,
  FETCH_CONVERSATIONS_FAILURE,
  FETCH_MESSAGES_REQUEST,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_FAILURE,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  SET_ACTIVE_CONVERSATION,
  SUBMIT_REWARD_REQUEST,
  SUBMIT_REWARD_SUCCESS,
  SUBMIT_REWARD_FAILURE,
  ADD_USER_MESSAGE,
  ADD_ASSISTANT_MESSAGE
} from '../actions/chatActions';

const initialState = {
  conversations: [],
  messages: [],
  activeConversation: null,
  loading: false,
  error: null,
  isTyping: false
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONVERSATIONS_REQUEST:
    case FETCH_MESSAGES_REQUEST:
    case SEND_MESSAGE_REQUEST:
    case SUBMIT_REWARD_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_CONVERSATIONS_SUCCESS:
      return { ...state, loading: false, conversations: action.payload };
    case FETCH_MESSAGES_SUCCESS:
      return { ...state, loading: false, messages: action.payload };
    case SEND_MESSAGE_SUCCESS:
      return { 
        ...state, 
        loading: false,
      };
    case ADD_USER_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isTyping: true
      };
    case ADD_ASSISTANT_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isTyping: false
      };
    case SUBMIT_REWARD_SUCCESS:
      return {
        ...state,
        loading: false,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.id ? { ...conv, gen_reward_timeout_datetime: null } : conv
        )
      };
    case FETCH_CONVERSATIONS_FAILURE:
    case FETCH_MESSAGES_FAILURE:
    case SEND_MESSAGE_FAILURE:
    case SUBMIT_REWARD_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SET_ACTIVE_CONVERSATION:
      return { ...state, activeConversation: action.payload };
    default:
      return state;
  }
};

export default chatReducer;