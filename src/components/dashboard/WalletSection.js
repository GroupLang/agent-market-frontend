import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaWallet, FaExclamationCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { styles } from '../styles/DashboardStyles';
import { createPaymentAccount, createWithdrawal } from '../../redux/actions/walletActions';

const MINIMUM_AMOUNT = 5;

const WalletSection = ({ 
  wallet, 
  depositAmount, 
  setDepositAmount, 
  withdrawAmount, 
  setWithdrawAmount, 
  handleDeposit,
  isDepositing, 
  isWithdrawing,
}) => {
  const dispatch = useDispatch();
  const [country, setCountry] = useState('US');
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [localError, setLocalError] = useState(null);
  const isLoading = useSelector(state => state.wallet.isLoading);
  const error = useSelector(state => state.wallet.error);

  const handleCreatePaymentAccount = async () => {
    try {
      await dispatch(createPaymentAccount(country));
      setShowAccountCreation(false);
    } catch (error) {
      console.error('Error in handleCreatePaymentAccount:', error);
    }
  };

  const handleDepositClick = () => {
    setLocalError(null);
    if (parseFloat(depositAmount) < MINIMUM_AMOUNT) {
      setLocalError(`Minimum deposit amount is $${MINIMUM_AMOUNT}`);
      return;
    }
    handleDeposit(depositAmount);
  };

  const handleWithdrawClick = async () => {
    setLocalError(null);
    if (parseFloat(withdrawAmount) < MINIMUM_AMOUNT) {
      setLocalError(`Minimum withdrawal amount is $${MINIMUM_AMOUNT}`);
      return;
    }
    try {
      await dispatch(createWithdrawal(parseFloat(withdrawAmount)));
      setWithdrawAmount('');
      setShowAccountCreation(false);
    } catch (error) {
      console.error('Error in handleWithdraw:', error);
      setShowAccountCreation(true);
    }
  };

  return (
    <div style={styles.walletSection}>
      <h2 style={styles.sectionTitle}>
        <FaWallet /> Wallet
      </h2>
      <div style={styles.balanceContainer}>
        <div style={styles.balanceDisplay}>
          <div>
            <p style={styles.balanceTitle}>Available Balance</p>
            <p style={styles.balance}>
              ${wallet && wallet.wallet_balance !== null ? wallet.wallet_balance.toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
        <div style={styles.balanceDisplay}>
          <div>
            <p style={styles.balanceTitle}>Held Balance</p>
            <p style={styles.balance}>
              ${wallet && wallet.held_balance !== null ? wallet.held_balance.toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>
      <div style={styles.walletActions}>
        <div style={styles.walletAction}>
          <h3 style={styles.actionTitle}>Deposit Funds</h3>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder={`$ Enter amount`}
            style={styles.input}
            min={MINIMUM_AMOUNT}
            step="0.01"
          />
          <button 
            onClick={handleDepositClick}
            style={{...styles.actionBtn, ...styles.depositBtn}}
            disabled={isDepositing}
          >
            <FaArrowUp /> {isDepositing ? 'Processing...' : 'Deposit'}
          </button>
        </div>
        <div style={styles.walletAction}>
          <h3 style={styles.actionTitle}>Withdraw Funds</h3>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder={`$ Enter amount`}
            style={styles.input}
            min={MINIMUM_AMOUNT}
            step="0.01"
          />
          <button 
            onClick={handleWithdrawClick}
            style={{...styles.actionBtn, ...styles.withdrawBtn}}
            disabled={isWithdrawing}
          >
            <FaArrowDown /> {isWithdrawing ? 'Processing...' : 'Withdraw'}
          </button>
        </div>
      </div>
      {(error || localError) && (
        <div style={styles.errorMessage}>
          <FaExclamationCircle style={styles.errorIcon} />
          {localError || error}
        </div>
      )}
      {showAccountCreation && !localError && (
        <div style={styles.accountCreationCard}>
          <div style={styles.accountCreationHeader}>
            <FaExclamationCircle style={styles.accountCreationIcon} />
            <h3 style={styles.accountCreationTitle}>Payment Account Required</h3>
          </div>
          <p style={styles.accountCreationText}>
            To withdraw funds, you need to create a payment account. This is a one-time process that enables secure withdrawals to your bank account. If you've already created an account, you may need to recreate it.
          </p>
          <div style={styles.countryInputContainer}>
            <label style={styles.countryInputLabel}>Country:</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value.toUpperCase())}
              placeholder="Enter code (e.g., US)"
              style={styles.countryInput}
              maxLength={2}
            />
          </div>
          <button
            onClick={handleCreatePaymentAccount}
            style={styles.createAccountBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Create Payment Account'}
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletSection;