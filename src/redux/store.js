import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import apiKeyReducer from './reducers/apiKeyReducer';
import walletReducer from './reducers/walletReducer';
import instanceReducer from './reducers/instanceReducers';
import chatReducer from './reducers/chatReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  apiKeys: apiKeyReducer,
  wallet: walletReducer,
  instances: instanceReducer,
  chat: chatReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;