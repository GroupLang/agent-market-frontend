import React from 'react';
import { FaUser } from 'react-icons/fa'; // Add this import
import { styles } from '../styles/DashboardStyles';

const UserInfoSection = ({ userData }) => (
  <section style={styles.userInfoSection}>
    <div style={styles.avatar}>
      <FaUser size={48} color="#ffffff" />
    </div>
    <div style={styles.userInfo}>
      <h2>{userData?.username}</h2>
      <p>{userData?.email}</p>
      <p>{userData?.fullname}</p>
    </div>
  </section>
);

export default UserInfoSection;