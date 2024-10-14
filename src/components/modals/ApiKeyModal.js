import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { FaCopy } from 'react-icons/fa';
import { styles } from '../styles/DashboardStyles';

const ApiKeyModal = ({ isOpen, onRequestClose, newApiKey, handleCopyClick, copySuccess }) => {
  useEffect(() => {
    return () => {
      // Cleanup function
      // Cancel any subscriptions or async tasks here
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={styles.modal}
      contentLabel="API Key Created"
    >
      <h2 style={styles.modalTitle}>API Key Created Successfully</h2>
      <p style={styles.modalText}>Here's your new API key. Please save it as it won't be shown again:</p>
      <div style={styles.apiKeyContainer}>
        <pre style={styles.apiKeyDisplay}>{newApiKey.api_key}</pre>
        <button onClick={handleCopyClick} style={styles.copyButton}>
          <FaCopy /> {copySuccess ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <button onClick={onRequestClose} style={styles.modalCloseBtn}>Close</button>
    </Modal>
  );
};

export default ApiKeyModal;