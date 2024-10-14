import {
  FETCH_API_KEYS_SUCCESS,
  CREATE_API_KEY_SUCCESS,
  DELETE_API_KEY_SUCCESS,
  TOGGLE_API_KEY_SUCCESS,
} from '../actions/apiKeyActions';

const initialState = {
  keys: [],
};

const apiKeyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_API_KEYS_SUCCESS:
      return {
        ...state,
        keys: action.payload,
      };
    case CREATE_API_KEY_SUCCESS:
      return {
        ...state,
        keys: [...state.keys, action.payload],
      };
    case DELETE_API_KEY_SUCCESS:
      return {
        ...state,
        keys: state.keys.filter(key => key.name !== action.payload),
      };
    case TOGGLE_API_KEY_SUCCESS:
      return {
        ...state,
        keys: state.keys.map(key =>
          key.name === action.payload.name ? action.payload : key
        ),
      };
    default:
      return state;
  }
};

export default apiKeyReducer;