import React from 'react';
import { styles } from '../styles/DashboardStyles';

const Header = ({ handleLogout }) => (
  <nav style={styles.nav}>
    <h1 style={styles.logo}>Agent Market</h1>
    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
  </nav>
);

export default Header;