import axios from 'axios';
import { toast } from 'react-toastify';

// Action Types
export const SET_WALLET_BALANCE = 'SET_WALLET_BALANCE';
export const SET_WALLET_LOADING = 'SET_WALLET_LOADING';
export const SET_WALLET_ERROR = 'SET_WALLET_ERROR';
export const SET_PAYMENT_ACCOUNT_URL = 'SET_PAYMENT_ACCOUNT_URL';
export const CLEAR_PAYMENT_ACCOUNT_URL = 'CLEAR_PAYMENT_ACCOUNT_URL';
export const CLEAR_WALLET_ERROR = 'CLEAR_WALLET_ERROR';

const API_URL = 'https://api.agent.market/v1/payment';

// Action Creators
export const setWalletBalance = (walletData) => ({
  type: SET_WALLET_BALANCE,
  payload: walletData,
});

export const setWalletLoading = (isLoading) => ({
  type: SET_WALLET_LOADING,
  payload: isLoading,
});

export const setWalletError = (error) => ({
  type: SET_WALLET_ERROR,
  payload: error,
});

export const setPaymentAccountUrl = (url) => ({
  type: SET_PAYMENT_ACCOUNT_URL,
  payload: url,
});

export const clearPaymentAccountUrl = () => ({
  type: CLEAR_PAYMENT_ACCOUNT_URL,
});

export const clearWalletError = () => ({
  type: CLEAR_WALLET_ERROR,
});

// New action to create a payment account
export const createPaymentAccount = (country) => async (dispatch, getState) => {
  dispatch(setWalletLoading(true));
  try {
    const { token } = getState().auth;
    const response = await axios.post(`${API_URL}/create-payment-account`, { country }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && response.data.url) {
      // Open the URL in a new tab
      window.open(response.data.url, '_blank');
      dispatch(setPaymentAccountUrl(response.data.url));
      toast.success('Payment account creation initiated. Please complete the process in the new tab.');
    } else {
      throw new Error('No URL received for payment account creation');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating payment account:', error);
    dispatch(setWalletError('Failed to create payment account'));
    toast.error('Failed to create payment account');
    throw error;
  } finally {
    dispatch(setWalletLoading(false));
  }
};

export const fetchWalletBalance = () => async (dispatch, getState) => {
  dispatch(setWalletLoading(true));
  try {
    const { token } = getState().auth;
    const response = await axios.get(`${API_URL}/balance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch(setWalletBalance(response.data));
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    
    // Handle specific error cases
    if (!navigator.onLine) {
      dispatch(setWalletError('No internet connection. Please check your network.'));
      toast.error('No internet connection. Please check your network.');
    } else if (error.response) {
      // Handle different HTTP error status codes
      switch (error.response.status) {
        case 401:
          dispatch(setWalletError('Session expired. Please login again.'));
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          dispatch(setWalletError('Access denied. Please check your permissions.'));
          toast.error('Access denied. Please check your permissions.');
          break;
        case 500:
          dispatch(setWalletError('Server error. Please try again later.'));
          toast.error('Server error. Please try again later.');
          break;
        default:
          dispatch(setWalletError(error.response.data?.detail || 'Failed to fetch wallet balance'));
          toast.error(error.response.data?.detail || 'Failed to fetch wallet balance');
      }
    } else {
      dispatch(setWalletError('Network error. Please try again.'));
      toast.error('Network error. Please try again.');
    }
  } finally {
    dispatch(setWalletLoading(false));
  }
};

export const createDeposit = (amount) => async (dispatch, getState) => {
  dispatch(setWalletLoading(true));
  try {
    const { token } = getState().auth;
    const response = await axios.post(`${API_URL}/deposit`, { amount }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch(setWalletLoading(false));
    return response.data;
  } catch (error) {
    console.error('Error creating deposit:', error);
    dispatch(setWalletError('Failed to create deposit'));
    dispatch(setWalletLoading(false));
    toast.error('Failed to create deposit');
    throw error;
  }
};

// Modify the existing createWithdrawal action
export const createWithdrawal = (amount) => async (dispatch, getState) => {
  dispatch(setWalletLoading(true));
  try {
    const { token } = getState().auth;
    const response = await axios.post(`${API_URL}/withdraw`, { amount }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch(fetchWalletBalance());
    toast.success('Withdrawal initiated successfully');
    return response.data;
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      if (error.response.status === 500) {
        dispatch(setWalletError('Server error occurred. Please try again later or create a new payment account.'));
      } else if (error.response.status === 400 && error.response.data.detail && error.response.data.detail.includes("Stripe account not found")) {
        dispatch(setWalletError('Stripe account not found. Please create one first.'));
      } else {
        dispatch(setWalletError(error.response.data.detail || 'Failed to create withdrawal. You may need to create a new payment account.'));
      }
    } else {
      dispatch(setWalletError('Network error. Please check your connection or try creating a new payment account.'));
    }
    toast.error('Withdrawal failed. You may need to create a new payment account.');
    throw error; // Always throw the error to be caught in the component
  } finally {
    dispatch(setWalletLoading(false));
  }
};