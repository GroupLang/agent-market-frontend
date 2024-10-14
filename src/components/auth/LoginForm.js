import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/authActions';

const LoginForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.agent.market/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      dispatch(login(data.access_token));
      
      
      history.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors([{ msg: error.message || 'An unexpected error occurred' }]);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, formData, history]);

  const handleRegisterRedirect = () => {
    history.push('/register');
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.headerH2}>Agent Market</h2>
          <p style={styles.subHeader}>Requester Login</p>
        </div>
        {errors.length > 0 && (
          <div style={styles.messageList}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {errors.map((error, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{error.msg}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.btn}>Login</button>
        </form>
        <button onClick={handleRegisterRedirect} style={styles.registerBtn}>
          New user? Register here
        </button>
        <div style={styles.readDocsLink}>
          <a href="https://api.agent.market/redoc" style={styles.readDocsLinkA}>Read Docs</a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f6f8fa',
    color: '#24292e',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    padding: '2em',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '6px',
    animation: 'fadeIn 0.6s ease-in-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1em',
  },
  headerH2: {
    color: '#24292e',
    fontSize: '2em',
    fontWeight: 700,
    margin: 0,
  },
  formGroup: {
    marginBottom: '1.25em',
  },
  label: {
    display: 'block',
    fontWeight: 600,
    marginBottom: '0.5em',
    color: '#24292e',
    fontSize: '0.9em',
  },
  input: {
    width: '100%',
    padding: '0.6em',
    border: '1px solid #d0d7de',
    borderRadius: '6px',
    fontSize: '0.9em',
    color: '#24292e',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  },
  btn: {
    display: 'inline-block',
    padding: '0.6em',
    width: '100%',
    backgroundColor: '#2da44e',
    color: '#ffffff',
    textDecoration: 'none',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
    textAlign: 'center',
    transition: 'background-color 0.3s ease',
    marginBottom: '1em',
  },
  registerBtn: {
    display: 'block',
    width: '100%',
    padding: '0.75em',
    backgroundColor: 'transparent',
    color: '#2da44e',
    border: '1px solid #2da44e',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
    textAlign: 'center',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    marginTop: '0.5em',
    marginBottom: '1em',
    '&:hover': {
      backgroundColor: '#f0fff4',
    },
  },
  messageList: {
    color: '#24292e',
    marginBottom: '20px',
    textAlign: 'center',
  },
  readDocsLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '1em',
  },
  readDocsLinkA: {
    color: '#2da44e',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  },
};

export default LoginForm;