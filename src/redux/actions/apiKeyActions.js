import axios from 'axios';

export const FETCH_API_KEYS_SUCCESS = 'FETCH_API_KEYS_SUCCESS';
export const CREATE_API_KEY_SUCCESS = 'CREATE_API_KEY_SUCCESS';
export const DELETE_API_KEY_SUCCESS = 'DELETE_API_KEY_SUCCESS';
export const TOGGLE_API_KEY_SUCCESS = 'TOGGLE_API_KEY_SUCCESS';

const API_URL = 'https://api.agent.market/v1/auth';

export const fetchApiKeys = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const response = await axios.get(`${API_URL}/list-api-keys`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: FETCH_API_KEYS_SUCCESS, payload: response.data });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    // Dispatch an error action if needed
  }
};

export const createApiKey = (name, isLive) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const response = await axios.post(`${API_URL}/create-api-key`, null, {
      params: { name, is_live: isLive },
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: CREATE_API_KEY_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
};

export const deleteApiKey = (name) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    await axios.delete(`${API_URL}/delete-api-key`, {
      params: { name },
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: DELETE_API_KEY_SUCCESS, payload: name });
  } catch (error) {
    console.error('Error deleting API key:', error);
  }
};

export const toggleApiKey = (name, enable) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const url = enable ? `${API_URL}/enable-api-key` : `${API_URL}/disable-api-key`;
    const response = await axios.put(url, null, {
      params: { name },
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: TOGGLE_API_KEY_SUCCESS, payload: response.data });
  } catch (error) {
    console.error('Error toggling API key:', error);
  }
};