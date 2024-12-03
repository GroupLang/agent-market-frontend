import React, { useState } from 'react';


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    fullname: ''
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('https://api.agent.market/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) {
          if (data.detail && Array.isArray(data.detail)) {
            const errorMessages = data.detail.map(error => error.msg).join('. ');
            throw new Error(errorMessages);
          } else {
            throw new Error(data.detail || 'Registration failed');
          }
        }
        setIsRegistered(true);
      } else {
        const text = await response.text();
        throw new Error('The server returned an unexpected response');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An unexpected error occurred');
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  if (isRegistered) {
    return (
      <div style={styles.body}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h2 style={styles.headerH2}>Agent Market</h2>
          </div>
          <h2 style={styles.successHeader}>Registration Successful</h2>
          <p style={styles.successMessage}>
            Welcome to Agent Market! Your account has been successfully created. We are excited to have you on board. Your account can also be used on <a href="https://marketrouter.ai" style={{ color: '#2da44e', textDecoration: 'none', fontWeight: 'bold' }}>marketrouter.ai</a> - our sister platform.
          </p>
          <div style={styles.buttonContainer}>
            <a href="/" style={styles.btn}>Back to Home</a>
            <a href="https://api.agent.market/redoc" style={styles.btn}>Read Docs</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.headerH2}>Agent Market</h2>
        </div>
        {error && <div style={styles.errorMessage}>{error}</div>}
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
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
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
          <div style={styles.formGroup}>
            <label htmlFor="fullname" style={styles.label}>Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.btn}>Register</button>
        </form>
        <button onClick={handleLoginRedirect} style={styles.loginBtn}>
          Existing user? Sign in here
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
  loginBtn: {
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

export default RegistrationForm;