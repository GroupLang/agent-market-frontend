import { toast } from 'react-toastify';

export const FETCH_INSTANCES_REQUEST = 'FETCH_INSTANCES_REQUEST';
export const FETCH_INSTANCES_SUCCESS = 'FETCH_INSTANCES_SUCCESS';
export const FETCH_INSTANCES_FAILURE = 'FETCH_INSTANCES_FAILURE';
export const CREATE_INSTANCE_REQUEST = 'CREATE_INSTANCE_REQUEST';
export const CREATE_INSTANCE_SUCCESS = 'CREATE_INSTANCE_SUCCESS';
export const CREATE_INSTANCE_FAILURE = 'CREATE_INSTANCE_FAILURE';
export const FETCH_INVOLVED_PROVIDERS_REQUEST = 'FETCH_INVOLVED_PROVIDERS_REQUEST';
export const FETCH_INVOLVED_PROVIDERS_SUCCESS = 'FETCH_INVOLVED_PROVIDERS_SUCCESS';
export const FETCH_INVOLVED_PROVIDERS_FAILURE = 'FETCH_INVOLVED_PROVIDERS_FAILURE';

export const fetchInstances = (authToken, status = 0) => async (dispatch) => {
  dispatch({ type: FETCH_INSTANCES_REQUEST });
  try {
    const response = await fetch(`https://api.agent.market/v1/instances/for-current-user?instance_status=${status}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    dispatch({ type: FETCH_INSTANCES_SUCCESS, payload: data.results || data });
  } catch (error) {
    dispatch({ type: FETCH_INSTANCES_FAILURE, payload: error.message });
  }
};

export const createInstance = (authToken, instanceParams, inputMessage) => async (dispatch) => {
  dispatch({ type: CREATE_INSTANCE_REQUEST });
  try {
    const response = await fetch('https://api.agent.market/v1/instances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        ...instanceParams,
        max_credit_per_instance: parseFloat(instanceParams.max_credit_per_instance.toFixed(2)),
        messages: [{ role: 'user', content: inputMessage }]
      })
    });
    if (!response.ok) throw new Error('Failed to create instance');
    const data = await response.json();
    dispatch({ type: CREATE_INSTANCE_SUCCESS, payload: data });
    toast.success('Instance created successfully!');
  } catch (error) {
    dispatch({ type: CREATE_INSTANCE_FAILURE, payload: error.message });
    toast.error('Failed to create instance');
  }
};

export const fetchInvolvedProviders = (authToken, instance_id) => async (dispatch) => {
  dispatch({ type: FETCH_INVOLVED_PROVIDERS_REQUEST });
  try {
    const response = await fetch(`https://api.agent.market/v1/instances/involved-providers?instance_id=${instance_id}`, {
    
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    dispatch({ type: FETCH_INVOLVED_PROVIDERS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: FETCH_INVOLVED_PROVIDERS_FAILURE, payload: error.message });
  }
};