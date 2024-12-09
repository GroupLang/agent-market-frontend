import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAIL,
} from '../actions/authActions';

const initialState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  token: localStorage.getItem('authToken'),
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case REFRESH_TOKEN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        error: action.payload,
      };
    case LOGIN_SUCCESS:
    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload,
        error: null,
      };
    case LOGOUT:
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      return {
        ...initialState,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};

export default authReducer;