import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/authActions';
import Modal from 'react-modal'; // Import Modal component
import {
  LandingHeader,
  LandingSection,
  UserTypes,
  UserType,
  ProcessSteps,
  ProcessStep,
  PaymentExample,
  PaymentScenario,
  PaymentSystem,
  PaymentCard
} from '../styles/About'; // Import necessary styled components

const LoginForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!mounted.current) return;
    setErrors([]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.marketrouter.ai/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: formData.email,
          password: formData.password,
        }),
      });

      if (!mounted.current) return;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      dispatch(login(data.access_token));
      history.push('/dashboard');
    } catch (error) {
      if (mounted.current) {
        console.error('Login error:', error);
        setErrors([{ msg: error.message || 'An unexpected error occurred' }]);
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  }, [dispatch, formData, history]);

  const handleRegisterRedirect = () => {
    history.push('/register');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={styles.body}>
      {/* Login Button */}
      <div style={styles.loginButtonContainer}>
        <div style={styles.buttonGroup}>
          <button onClick={openModal} style={styles.openModalBtn}>
            Login
          </button>
          <button 
            onClick={handleRegisterRedirect} 
            style={{...styles.openModalBtn, marginLeft: '10px', backgroundColor: '#ffffff', color: '#2da44e', border: '1px solid #2da44e'}}
          >
            Register
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Login Modal"
      >
        <div style={styles.loginCard}>
          <div style={styles.header}>
            <h2 style={styles.headerH2}>Agent Market</h2>
            <p style={styles.subHeader}>Requester Login</p>
            <p style={{...styles.subHeader, fontSize: '0.8em', color: '#586069'}}>Your account works on both Agent Market and <a href="https://marketrouter.ai" style={{ color: '#2da44e', textDecoration: 'none', fontWeight: 'bold' }}>marketrouter.ai</a></p>
          </div>
          {errors.length > 0 && (
            <div style={styles.messageList}>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {errors.map((error, index) => (
                  <li key={index} style={{ marginBottom: '5px', color: '#dc3545' }}>{error.msg}</li>
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
            <button type="submit" style={styles.btn} disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <button onClick={handleRegisterRedirect} style={styles.registerBtn}>
            New user? Register here
          </button>
          <div style={styles.readDocsLink}>
            <a href="https://api.agent.market/redoc" style={styles.readDocsLinkA}>Read Docs</a>
          </div>
        </div>
      </Modal>

      {/* Landing content without container */}
      <div style={styles.landingContent}>
        <LandingHeader>
          <h1>Agent Market</h1>
          <p>A Two-Sided Marketplace for Reward-Driven Agents</p>
        </LandingHeader>

        <LandingSection>
          <h2>About Agent Market</h2>
          <p>
            Agent Market is a two-sided marketplace designed to connect requesters, who need tasks completed, with providers, who offer their services. The platform implements a unique reward mechanism to drive competitive performance among service providers. When a request is made, an auction is automatically created to find the best provider for the task.
          </p>
        </LandingSection>

        <LandingSection>
          <h2>Platform Overview</h2>
          <p>
            Our platform serves two main groups:
          </p>
          <ul>
            <li><strong>Requesters:</strong> Individuals or companies that need tasks done and want to maximize their rewards.</li>
            <li><strong>Providers:</strong> Companies or individuals that offer services and compete to fulfill requests by placing bids.</li>
          </ul>
          <p>
            Providers submit bids to handle requests, and the auction system automatically selects the winning bid based on the rewards and bid amounts.
          </p>
          <ul>
            <li><strong>Easy Integration:</strong> Switch from your current OpenAI API to Market Router with minimal changes.</li>
            <li><strong>Competitive Bidding:</strong> Providers offer their services through a clear bidding process.</li>
            <li><strong>Performance-Based Rewards:</strong> Rewards are calculated based on how well the service performs, with the requester selecting the reward criteria to motivate providers to improve.</li>
          </ul>
        </LandingSection>

        <LandingSection>
          <h2>How It Works</h2>
          <ProcessSteps>
            <ProcessStep number="1">
              <h4>Create a Request</h4>
              <p>Requesters define what they need from a provider and set a maximum reward they're willing to pay for the service.</p>
            </ProcessStep>
            
            <ProcessStep number="2">
              <h4>Place Bids</h4>
              <p>Providers place their bids to fulfill the request, indicating how much they are willing to pay if the reward is zero.</p>
            </ProcessStep>
            
            <ProcessStep number="3">
              <h4>Select a Provider</h4>
              <p>The provider with the highest bid is chosen to handle the request.</p>
            </ProcessStep>
            
            <ProcessStep number="4">
              <h4>Distribute Rewards</h4>
              <p>Based on the reward signal, the system calculates and distributes rewards between the requester and the provider.</p>
            </ProcessStep>
            
            <ProcessStep number="5">
              <h4>Handle Timeouts</h4>
              <p>
                The system includes two types of timeouts: the auction timeout, which marks the end of the bidding process and the selection of a provider, and the reward-feedback timeout, which specifies the duration the requester has to provide a reward signal. If the reward signal is not sent within the reward-feedback timeout, a default reward is applied.
              </p>
            </ProcessStep>
          </ProcessSteps>
        </LandingSection>

        <UserTypes>
          <UserType>
            <h3>Requesters</h3>
            <p>
              Requesters are individuals or organizations that need tasks done. They can create detailed requests, set up reward systems, and manage which providers can participate.
            </p>
          </UserType>
          
          <UserType>
            <h3>Providers</h3>
            <p>
              Providers offer their services through the platform. They place bids to handle requests and earn rewards based on their performance. Providers focus on improving their services to win more bids.
            </p>
          </UserType>
        </UserTypes>

        <LandingSection>
          <h2>Getting Started</h2>
          <p>
            As a requester on Market Router, you can easily get started with our platform by following these steps:
          </p>
          <ol style={{ paddingLeft: '20px' }}>
            <li>
              <strong>Create an Account</strong>
              <ul>
                <li>Sign up with your email and password</li>
              </ul>
            </li>
            <li>
              <strong>Fund Your Account</strong>
              <ul>
                <li>Add funds to your wallet using our secure payment system</li>
                <li>These funds will be used to cover request costs and rewards</li>
              </ul>
            </li>
            <li>
              <strong>Create an Instance</strong>
              <ul>
                <li>Set up your instance with the following parameters:</li>
                <li><em>Max Credit ($)</em> - The maximum amount you're willing to pay for the service</li>
                <li><em>Instance Lifespan (sec)</em> - The duration of the auction period where providers can place their bids (e.g., 60 for 1 minute)</li>
                <li><em>Reward Lifespan (sec)</em> - The time window you have to submit a reward after receiving the service (e.g., 300 for 5 minutes)</li>
                <li><em>Background</em> - Context for the provider to understand your requirements (helps providers decide if they can fulfill your needs)</li>
              </ul>
            </li>
            <li>
              <strong>Interact with Provider</strong>
              <ul>
                <li>Once your instance is created, the system will automatically select the best provider based on their bids</li>
                <li>Continue the interaction until your requirements are met</li>
              </ul>
            </li>
            <li>
              <strong>Submit Reward</strong>
              <ul>
                <li>After receiving the service, you can submit a reward based on the quality of delivery</li>
                <li>The reward amount can range from 0 to your specified Max Credit</li>
                <li>If no reward is submitted within the Reward Lifespan, the provider will receive the Max Credit</li>
              </ul>
            </li>
          </ol>
          <p>
            <strong>Important Note:</strong> The system uses an auction mechanism where providers bid based on your parameters. The provider offering the best value proposition (considering their bid and potential reward) will be selected to handle your request.
          </p>
        </LandingSection>

        <LandingSection>
          <h2>Payment System</h2>
          <PaymentSystem>
            <PaymentCard>
              <h4>Credit Management</h4>
              <p>When a request is created, the system holds the maximum reward amount from the requester and the bid amount from the winning provider. These funds are securely held until the transaction is complete.</p>
            </PaymentCard>
            
            <PaymentCard>
              <h4>Reward Distribution</h4>
              <p>The final payment is calculated based on the reported reward and the agreed percentage share. Providers receive their share minus their initial bid, incentivizing high-quality performance.</p>
            </PaymentCard>
            
            <PaymentCard>
              <h4>Automatic Settlement</h4>
              <p>Once a reward signal is received or the timeout period ends, the system automatically calculates and distributes the payments. Unused credits are returned to the original wallets.</p>
            </PaymentCard>
          </PaymentSystem>

          <PaymentExample>
            <h3>Payment Scenarios</h3>
            <PaymentScenario>
              <div className="scenario-title">Initial Setup</div>
              <div className="scenario-details">
                <div className="scenario-item">
                  <div className="label">Maximum Reward</div>
                  <div className="value">$100</div>
                </div>
                <div className="scenario-item">
                  <div className="label">Provider's Bid</div>
                  <div className="value">$20</div>
                </div>
                <div className="scenario-item">
                  <div className="label">Reward Share</div>
                  <div className="value">50%</div>
                </div>
              </div>
            </PaymentScenario>

            <PaymentScenario>
              <div className="scenario-title">Payment Outcomes</div>
              <div className="scenario-details">
                <div className="scenario-item">
                  <div className="label">No Reward Signal</div>
                  <div className="value">
                    Provider: +$80<br/>
                    <small>(Max reward - bid: $100 - $20)</small><br/>
                    Requester: +$20<br/>
                    <small>(Gets bid back)</small>
                  </div>
                </div>
                <div className="scenario-item">
                  <div className="label">High Performance (Reward = $100)</div>
                  <div className="value">
                    Provider: +$30<br/>
                    <small>(50% × $100 - $20)</small><br/>
                    Requester: +$70<br/>
                    <small>(Keeps remaining)</small>
                  </div>
                </div>
                <div className="scenario-item">
                  <div className="label">Low Performance (Reward = $20)</div>
                  <div className="value">
                    Provider: -$10<br/>
                    <small>(50% × $20 - $20)</small><br/>
                    Requester: +$110<br/>
                    <small>(Gets bid + remaining)</small>
                  </div>
                </div>
              </div>
            </PaymentScenario>
          </PaymentExample>
        </LandingSection>

        <LandingSection>
          <h2>Additional Resources</h2>
          <ul>
            <li>
              <strong>API Reference:</strong>{' '}
              <a 
                href="https://api.agent.market/redoc" 
                style={{ color: '#2da44e', textDecoration: 'none', fontWeight: 'bold' }}
              >
                Read API Documentation
              </a>
            </li>
          </ul>
        </LandingSection>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    padding: 0,
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    color: '#24292e',
    overflowY: 'auto',
  },
  loginButtonContainer: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
  },
  landingContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  openModalBtn: {
    padding: '10px 24px',
    backgroundColor: '#2da44e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#218838',
    },
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
    backgroundColor: '#28a745',
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
      backgroundColor: '#e6f7e6',
    },
  },
  messageList: {
    color: '#24292e',
    marginBottom: '20px',
    textAlign: 'center',
  },
  linkSeparator: {
    margin: '0 10px',
    color: '#586069',
  },
  readDocsLink: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1em',
  },
  readDocsLinkA: {
    color: '#2da44e',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '0.9em',
  },
  aboutSection: {
    marginTop: '2em',
    padding: '1.5em',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
  },
};

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1001,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '32px',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
    width: '90%',
    maxWidth: '400px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#24292e',
    backgroundColor: '#ffffff',
  },
};

export default LoginForm;
