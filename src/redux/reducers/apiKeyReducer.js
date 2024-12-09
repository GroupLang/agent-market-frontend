import {
  FETCH_API_KEYS_SUCCESS,
  CREATE_API_KEY_SUCCESS,
  DELETE_API_KEY_SUCCESS,
  TOGGLE_API_KEY_SUCCESS,
  API_KEY_ERROR,
} from '../actions/apiKeyActions';

const initialState = {
  keys: [],
  error: null,
  isLoading: false
};

const apiKeyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_API_KEYS_SUCCESS:
      return {
        ...state,
        keys: action.payload,
        error: null,
        isLoading: false
      };
    case CREATE_API_KEY_SUCCESS:
      return {
        ...state,
        keys: [...state.keys, action.payload],
        error: null,
        isLoading: false
      };
    case DELETE_API_KEY_SUCCESS:
      return {
        ...state,
        keys: state.keys.filter(key => key.name !== action.payload),
        error: null,
        isLoading: false
      };
    case TOGGLE_API_KEY_SUCCESS:
      return {
        ...state,
        keys: state.keys.map(key =>
          key.name === action.payload.name ? action.payload : key
        ),
        error: null,
        isLoading: false
      };
    case API_KEY_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
};

export default apiKeyReducer;