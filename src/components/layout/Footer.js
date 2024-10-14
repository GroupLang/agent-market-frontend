import React from 'react';
import { styles } from '../styles/DashboardStyles';

const Footer = () => (
  <footer style={styles.footer}>
    <p>&copy; 2023 Agent Market. All rights reserved.</p>
    <nav>
      <a href="/terms" style={styles.footerLink}>Terms of Service</a>
      <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
      <a href="/contact" style={styles.footerLink}>Contact Us</a>
    </nav>
  </footer>
);

export default Footer;