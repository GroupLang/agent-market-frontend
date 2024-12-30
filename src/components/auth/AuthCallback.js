import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/authActions';
import { toast } from 'react-toastify';

const AuthCallback = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      console.log('Received token from callback');
      dispatch(login(token));
      history.push('/dashboard');
    } else if (error) {
      console.error('Authentication error:', error);
      toast.error(error);
      history.push('/');
    } else {
      console.error('No token or error received');
      toast.error('Authentication failed');
      history.push('/');
    }
  }, [dispatch, history, location]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Processing authentication...</div>
    </div>
  );
};

export default AuthCallback; 