import axios from 'axios';

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA_SUCCESS';
export const FETCH_USER_DATA_FAIL = 'FETCH_USER_DATA_FAIL';

const API_URL = 'https://api.agent.market/v1/auth';

export const register = (email, username, fullname, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      email,
      username,
      fullname,
      password,
    });
    dispatch({ type: REGISTER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: REGISTER_FAIL, payload: error.response.data });
  }
};

export const login = (token) => (dispatch) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('isAuthenticated', 'true');
  dispatch({
    type: LOGIN_SUCCESS,
    payload: token
  });
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('authToken');
  dispatch({ type: LOGOUT });
};

export const fetchUserData = () => async (dispatch, getState) => {
  try {
    const { auth: { token: authToken } } = getState();
    if (!authToken) {
      throw new Error('No auth token found');
    }
    const response = await fetch(`${API_URL}/users/me/`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    dispatch({ type: FETCH_USER_DATA_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    dispatch({ type: FETCH_USER_DATA_FAIL, payload: error.message });
    if (error.message === 'Unauthorized') {
      dispatch(logout());
    }
    throw error;
  }
};