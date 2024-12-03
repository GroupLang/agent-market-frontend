import React from 'react';
import { FaUser } from 'react-icons/fa'; // Add this import
import { styles } from '../styles/DashboardStyles';

const sharedAccountStyle = {
    margin: '1em 0 0 0',
    padding: '0.5em',
    backgroundColor: '#f6f8fa',
    borderRadius: '6px',
    fontSize: '0.85em',
    color: '#586069',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em'
  };

const UserInfoSection = ({ userData }) => (
  <section style={styles.userInfoSection}>
    <div style={styles.avatar}>
      <FaUser size={48} color="#ffffff" />
    </div>
    <div style={styles.userInfo}>
      <h2>{userData?.username}</h2>
      <p>{userData?.email}</p>
      <p>{userData?.fullname}</p>
      <div style={sharedAccountStyle}>
        <span>✨ This account also works on </span>
        <a href="https://marketrouter.ai" style={{ color: '#2da44e', textDecoration: 'none', fontWeight: 'bold' }}>marketrouter.ai</a>
      </div>
    </div>
  </section>
);

export default UserInfoSection;