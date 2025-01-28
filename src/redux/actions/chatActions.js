export const FETCH_CONVERSATIONS_REQUEST = 'FETCH_CONVERSATIONS_REQUEST';
export const FETCH_CONVERSATIONS_SUCCESS = 'FETCH_CONVERSATIONS_SUCCESS';
export const FETCH_CONVERSATIONS_FAILURE = 'FETCH_CONVERSATIONS_FAILURE';
export const FETCH_MESSAGES_REQUEST = 'FETCH_MESSAGES_REQUEST';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_FAILURE = 'FETCH_MESSAGES_FAILURE';
export const SEND_MESSAGE_REQUEST = 'SEND_MESSAGE_REQUEST';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';
export const SET_ACTIVE_CONVERSATION = 'SET_ACTIVE_CONVERSATION';
export const SUBMIT_REWARD_REQUEST = 'SUBMIT_REWARD_REQUEST';
export const SUBMIT_REWARD_SUCCESS = 'SUBMIT_REWARD_SUCCESS';
export const SUBMIT_REWARD_FAILURE = 'SUBMIT_REWARD_FAILURE';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const FETCH_WINNING_PROVIDERS_REQUEST = 'FETCH_WINNING_PROVIDERS_REQUEST';
export const FETCH_WINNING_PROVIDERS_SUCCESS = 'FETCH_WINNING_PROVIDERS_SUCCESS';
export const FETCH_WINNING_PROVIDERS_FAILURE = 'FETCH_WINNING_PROVIDERS_FAILURE';

export const fetchWinningProviders = (authToken, instanceId) => async (dispatch) => {
  dispatch({ type: FETCH_WINNING_PROVIDERS_REQUEST });
  try {
    const response = await fetch(`https://api.agent.market/v1/instances/${instanceId}/winning-providers`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const providers = await response.json();
    dispatch({ type: FETCH_WINNING_PROVIDERS_SUCCESS, payload: { instanceId, providers } });
    return providers;
  } catch (error) {
    dispatch({ type: FETCH_WINNING_PROVIDERS_FAILURE, payload: error.message });
    throw error;
  }
};

export const fetchConversations = (authToken) => async (dispatch) => {
  dispatch({ type: FETCH_CONVERSATIONS_REQUEST });
  try {
    const response = await fetch(`https://api.agent.market/v1/instances/for-current-user?instance_status=3`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error text:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const instances = await response.json();
    
    // Fetch winning providers for each instance
    const instancesWithProviders = await Promise.all(instances.map(async (instance) => {
      try {
        const providers = await dispatch(fetchWinningProviders(authToken, instance.id));
        return {
          ...instance,
          providers,
          conversations: providers.map(provider => ({
            id: instance.id,
            providerId: provider,
            creation_date: instance.creation_date,
            gen_reward_timeout_datetime: instance.gen_reward_timeout_datetime,
            payload: instance.payload || {},
            maxCredit: instance.max_credit_per_instance || 0,
            max_reward_for_estimation: instance.max_reward_for_estimation !== undefined ? instance.max_reward_for_estimation : null,
          }))
        };
      } catch (error) {
        console.error(`Failed to fetch providers for instance ${instance.id}:`, error);
        return instance;
      }
    }));

    dispatch({ type: FETCH_CONVERSATIONS_SUCCESS, payload: instancesWithProviders });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    dispatch({ type: FETCH_CONVERSATIONS_FAILURE, payload: error.message });
  }
};

export const fetchMessages = (authToken, conversationId, providerId) => async (dispatch) => {
  dispatch({ type: FETCH_MESSAGES_REQUEST });
  try {
    const response = await fetch(`https://api.agent.market/v1/chat/${conversationId}?provider_id=${providerId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const messages = await response.json();
    dispatch({ type: FETCH_MESSAGES_SUCCESS, payload: messages });
  } catch (error) {
    dispatch({ type: FETCH_MESSAGES_FAILURE, payload: error.message });
  }
};

export const sendMessage = (authToken, conversationId, providerId, message) => async (dispatch) => {
  dispatch({ type: SEND_MESSAGE_REQUEST });
  dispatch(addMessage({ 
    sender: 'requester', 
    message: message, 
    timestamp: new Date().toISOString() 
  }));

  try {
    const response = await fetch(`https://api.agent.market/v1/chat/send-message/${conversationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        provider_id: providerId
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data.status === 'ok') {
      dispatch({ type: SEND_MESSAGE_SUCCESS });
      dispatch(fetchMessages(authToken, conversationId, providerId));
    } else {
      throw new Error('Unexpected response from the API');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    dispatch({ type: SEND_MESSAGE_FAILURE, payload: error.message });
    dispatch(addMessage({ 
      sender: 'system', 
      message: 'Sorry, there was an error processing your request.',
      timestamp: new Date().toISOString()
    }));
  }
};

export const setActiveConversation = (conversation) => ({
  type: SET_ACTIVE_CONVERSATION,
  payload: conversation
});

export const submitReward = (authToken, conversationId, rewardValue) => async (dispatch) => {
  dispatch({ type: SUBMIT_REWARD_REQUEST });
  try {
    const bodyData = rewardValue !== null ? { gen_reward: rewardValue } : {};
    const response = await fetch(`https://api.agent.market/v1/instances/${conversationId}/report-reward`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    dispatch({ type: SUBMIT_REWARD_SUCCESS, payload: { id: conversationId, ...data } });
  } catch (error) {
    dispatch({ type: SUBMIT_REWARD_FAILURE, payload: error.message });
  }
};

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message
});
