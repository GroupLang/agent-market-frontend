import {
  SET_WALLET_BALANCE,
  SET_WALLET_LOADING,
  SET_WALLET_ERROR,
  SET_PAYMENT_ACCOUNT_URL,
  CLEAR_PAYMENT_ACCOUNT_URL,
  CLEAR_WALLET_ERROR
} from '../actions/walletActions';

const initialState = {
  wallet_balance: null,
  held_balance: null,
  currency: null,
  isLoading: false,
  error: null,
  paymentAccountUrl: null
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLET_BALANCE:
      return {
        ...state,
        wallet_balance: action.payload.wallet_balance,
        held_balance: action.payload.held_balance,
        currency: action.payload.currency,
        error: null,
        isLoading: false
      };
    case SET_WALLET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case SET_WALLET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case SET_PAYMENT_ACCOUNT_URL:
      return {
        ...state,
        paymentAccountUrl: action.payload
      };
    case CLEAR_PAYMENT_ACCOUNT_URL:
      return {
        ...state,
        paymentAccountUrl: null
      };
    case CLEAR_WALLET_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export default walletReducer;