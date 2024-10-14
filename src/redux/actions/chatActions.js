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
export const ADD_USER_MESSAGE = 'ADD_USER_MESSAGE';
export const ADD_ASSISTANT_MESSAGE = 'ADD_ASSISTANT_MESSAGE';

export const fetchConversations = (authToken) => async (dispatch) => {
  dispatch({ type: FETCH_CONVERSATIONS_REQUEST });
  try {
    const response = await fetch(`https://api.agent.market/v1/instances/?instance_status=3`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const formattedConversations = data.map(conv => ({
      id: conv.id,
      creation_date: conv.creation_date,
      gen_reward_timeout_datetime: conv.gen_reward_timeout_datetime,
      payload: conv.payload || {},
      maxCredit: conv.max_credit_per_instance || 0,
    }));
    dispatch({ type: FETCH_CONVERSATIONS_SUCCESS, payload: formattedConversations });
  } catch (error) {
    dispatch({ type: FETCH_CONVERSATIONS_FAILURE, payload: error.message });
  }
};

export const fetchMessages = (authToken, conversationId) => async (dispatch) => {
  dispatch({ type: FETCH_MESSAGES_REQUEST });
  try {
    const response = await fetch(`https://api.agent.market/v1/chat/completions/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    let allMessages = [];
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.user_message && item.user_message.length > 0) {
          const lastUserMessage = item.user_message[item.user_message.length - 1];
          allMessages.push({ role: 'user', content: lastUserMessage.content });
        }
        if (item.response && item.response.choices && item.response.choices.length > 0) {
          const lastResponse = item.response.choices[item.response.choices.length - 1].message;
          allMessages.push({ role: lastResponse.role, content: lastResponse.content });
        }
      });
    }
    dispatch({ type: FETCH_MESSAGES_SUCCESS, payload: allMessages });
  } catch (error) {
    dispatch({ type: FETCH_MESSAGES_FAILURE, payload: error.message });
  }
};

export const sendMessage = (authToken, conversationId, message) => async (dispatch, getState) => {
  dispatch({ type: SEND_MESSAGE_REQUEST });
  dispatch(addUserMessage({ role: 'user', content: message }));

  try {
    const { messages } = getState().chat;
    const lastMessages = messages.slice(-10);

    const response = await fetch(`https://api.agent.market/v1/chat/completions/${conversationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: lastMessages,
        model: 'gpt-3.5-turbo'
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data.response && data.response.choices && data.response.choices.length > 0) {
      const assistantMessage = data.response.choices[0].message;
      dispatch(addAssistantMessage(assistantMessage));
    } else {
      console.error('Unexpected API response structure:', data);
      throw new Error('Unexpected response structure from the API');
    }

    dispatch({ type: SEND_MESSAGE_SUCCESS });
  } catch (error) {
    console.error('Error sending message:', error);
    dispatch({ type: SEND_MESSAGE_FAILURE, payload: error.message });
    dispatch(addAssistantMessage({ role: 'system', content: 'Sorry, there was an error processing your request.' }));
  }
};

export const setActiveConversation = (conversation) => ({
  type: SET_ACTIVE_CONVERSATION,
  payload: conversation
});

export const submitReward = (authToken, conversationId, rewardValue) => async (dispatch) => {
  dispatch({ type: SUBMIT_REWARD_REQUEST });
  try {
    const response = await fetch(`https://api.agent.market/v1/instances/${conversationId}/report-reward`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gen_reward: rewardValue
      }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    dispatch({ type: SUBMIT_REWARD_SUCCESS, payload: { id: conversationId, ...data } });
  } catch (error) {
    dispatch({ type: SUBMIT_REWARD_FAILURE, payload: error.message });
  }
};

export const addUserMessage = (message) => ({
  type: ADD_USER_MESSAGE,
  payload: message
});

export const addAssistantMessage = (message) => ({
  type: ADD_ASSISTANT_MESSAGE,
  payload: message
});