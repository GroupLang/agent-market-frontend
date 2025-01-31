import axios from 'axios';

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA_SUCCESS';
export const FETCH_USER_DATA_FAIL = 'FETCH_USER_DATA_FAIL';
export const REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_FAIL = 'REFRESH_TOKEN_FAIL';
export const SET_GITHUB_USERNAME_SUCCESS = 'SET_GITHUB_USERNAME_SUCCESS';
export const SET_GITHUB_USERNAME_FAIL = 'SET_GITHUB_USERNAME_FAIL';

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

export const setGithubUsername = (github_username) => async (dispatch, getState) => {
  try {
    const { auth: { token } } = getState();
    if (!token) {
      throw new Error('No auth token found');
    }
    const response = await fetch(`${API_URL}/set-github-username?github_username=${encodeURIComponent(github_username)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Failed to set GitHub username');
    }
    const data = await response.json();
    dispatch({ type: SET_GITHUB_USERNAME_SUCCESS, payload: data });
  } catch (error) {
    console.error('Error setting GitHub username:', error);
    dispatch({ type: SET_GITHUB_USERNAME_FAIL, payload: error.message });
    throw error;
  }
};

export const login = (token) => (dispatch) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('isAuthenticated', 'true');
  dispatch({
    type: LOGIN_SUCCESS,
    payload: token
  });

  // Start token refresh cycle
  startTokenRefreshCycle(dispatch);
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isAuthenticated');
  dispatch({ type: LOGOUT });
};

export const refreshToken = () => async (dispatch) => {
  try {
    const currentToken = localStorage.getItem('authToken');
    if (!currentToken) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    const newToken = data.access_token;

    localStorage.setItem('authToken', newToken);
    dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: newToken });
    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    dispatch({ type: REFRESH_TOKEN_FAIL });
    dispatch(logout());
    throw error;
  }
};

// Helper function to manage token refresh cycle
const startTokenRefreshCycle = (dispatch) => {
  // Refresh token every 55 minutes (assuming 1-hour token lifetime)
  const REFRESH_INTERVAL = 55 * 60 * 1000; 

  const refreshCycle = async () => {
    try {
      await dispatch(refreshToken());
      setTimeout(refreshCycle, REFRESH_INTERVAL);
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  // Start the cycle
  setTimeout(refreshCycle, REFRESH_INTERVAL);
};

export const fetchUserData = () => async (dispatch, getState) => {
  let retries = 0;
  const maxRetries = 2;

  const attemptFetch = async () => {
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
      if (retries < maxRetries) {
        retries++;
        const backoffDelay = Math.min(1000 * Math.pow(2, retries), 10000);
        console.log(`Retrying fetchUserData in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return attemptFetch();
      }
      dispatch({ type: FETCH_USER_DATA_FAIL, payload: error.message });
      if (error.message === 'Unauthorized') {
        dispatch(logout());
      }
      throw error;
    }
  };

  return attemptFetch();
};
