import { createAxiosInstanceWithRetry } from '../../utils/apiUtils';

export const FETCH_API_KEYS_SUCCESS = 'FETCH_API_KEYS_SUCCESS';
export const CREATE_API_KEY_SUCCESS = 'CREATE_API_KEY_SUCCESS';
export const DELETE_API_KEY_SUCCESS = 'DELETE_API_KEY_SUCCESS';
export const TOGGLE_API_KEY_SUCCESS = 'TOGGLE_API_KEY_SUCCESS';
export const API_KEY_ERROR = 'API_KEY_ERROR';

const API_URL = 'https://api.agent.market/v1/auth';

let axiosInstance = null;

const getAxiosInstance = (store) => {
  if (!axiosInstance) {
    axiosInstance = createAxiosInstanceWithRetry(store);
  }
  return axiosInstance;
};

export const fetchApiKeys = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const axios = getAxiosInstance(getState);
    const response = await axios.get(`${API_URL}/list-api-keys`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: FETCH_API_KEYS_SUCCESS, payload: response.data });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    dispatch({ type: API_KEY_ERROR, payload: error.message });
  }
};

export const createApiKey = (name, isLive) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const axios = getAxiosInstance(getState);
    const response = await axios.post(`${API_URL}/create-api-key`, null, {
      params: { name, is_live: isLive },
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: CREATE_API_KEY_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.error('Error creating API key:', error);
    dispatch({ type: API_KEY_ERROR, payload: error.message });
    throw error;
  }
};

export const deleteApiKey = (name) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const axios = getAxiosInstance(getState);
    await axios.delete(`${API_URL}/delete-api-key`, {
      params: { name },
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: DELETE_API_KEY_SUCCESS, payload: name });
  } catch (error) {
    console.error('Error deleting API key:', error);
    dispatch({ type: API_KEY_ERROR, payload: error.message });
  }
};

export const toggleApiKey = (name, enable) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const axios = getAxiosInstance(getState);
    const url = enable ? `${API_URL}/enable-api-key` : `${API_URL}/disable-api-key`;
    const response = await axios.put(url, null, {
      params: { name },
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: TOGGLE_API_KEY_SUCCESS, payload: response.data });
  } catch (error) {
    console.error('Error toggling API key:', error);
    dispatch({ type: API_KEY_ERROR, payload: error.message });
  }
};