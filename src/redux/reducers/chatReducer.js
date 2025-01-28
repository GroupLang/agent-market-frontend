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
  ADD_MESSAGE,
  FETCH_WINNING_PROVIDERS_REQUEST,
  FETCH_WINNING_PROVIDERS_SUCCESS,
  FETCH_WINNING_PROVIDERS_FAILURE
} from '../actions/chatActions';

const initialState = {
  instances: [],
  conversations: [],
  messages: [],
  activeConversation: null,
  loading: false,
  error: null,
  providersLoading: false,
  providersError: null
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONVERSATIONS_REQUEST:
    case FETCH_MESSAGES_REQUEST:
    case SEND_MESSAGE_REQUEST:
    case SUBMIT_REWARD_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_WINNING_PROVIDERS_REQUEST:
      return { ...state, providersLoading: true, providersError: null };

    case FETCH_CONVERSATIONS_SUCCESS:
      return { 
        ...state, 
        loading: false,
        instances: action.payload,
        conversations: action.payload.reduce((acc, instance) => {
          if (instance.conversations) {
            return [...acc, ...instance.conversations];
          }
          return acc;
        }, [])
      };

    case FETCH_WINNING_PROVIDERS_SUCCESS:
      return {
        ...state,
        providersLoading: false,
        instances: state.instances.map(instance =>
          instance.id === action.payload.instanceId
            ? { ...instance, providers: action.payload.providers }
            : instance
        )
      };

    case FETCH_MESSAGES_SUCCESS:
      return { ...state, loading: false, messages: action.payload };

    case SEND_MESSAGE_SUCCESS:
      return { ...state, loading: false };

    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case SET_ACTIVE_CONVERSATION:
      return { ...state, activeConversation: action.payload };

    case SUBMIT_REWARD_SUCCESS:
      return {
        ...state,
        loading: false,
        instances: state.instances.map(instance =>
          instance.id === action.payload.id
            ? { ...instance, gen_reward_timeout_datetime: null }
            : instance
        )
      };

    case FETCH_CONVERSATIONS_FAILURE:
    case FETCH_MESSAGES_FAILURE:
    case SEND_MESSAGE_FAILURE:
    case SUBMIT_REWARD_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_WINNING_PROVIDERS_FAILURE:
      return { ...state, providersLoading: false, providersError: action.payload };

    default:
      return state;
  }
};

export default chatReducer;
