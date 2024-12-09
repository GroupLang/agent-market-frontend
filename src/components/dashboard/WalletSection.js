import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaWallet, FaExclamationCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import styled from 'styled-components';
import { createPaymentAccount, createWithdrawal } from '../../redux/actions/walletActions';

const MINIMUM_AMOUNT = 5;

const WalletContainer = styled.div`
  background-color: #ffffff;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  margin-bottom: 2em;

  @media (max-width: 768px) {
    padding: 1.5em;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5em;
  color: #24292e;
  margin-bottom: 1.5em;
  display: flex;
  align-items: center;
  gap: 0.5em;

  @media (max-width: 768px) {
    font-size: 1.3em;
    margin-bottom: 1em;
  }
`;

const BalanceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2em;
  margin-bottom: 2em;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1em;
  }
`;

const BalanceDisplay = styled.div`
  flex: 1;
  background-color: #f8f9fa;
  padding: 1.5em;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const BalanceTitle = styled.p`
  font-size: 1em;
  color: #6c757d;
  margin-bottom: 0.5em;

  @media (max-width: 768px) {
    font-size: 0.9em;
  }
`;

const Balance = styled.p`
  font-size: 1.8em;
  font-weight: bold;
  color: #24292e;

  @media (max-width: 768px) {
    font-size: 1.5em;
  }
`;

const WalletActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2em;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5em;
  }
`;

const WalletAction = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const ActionTitle = styled.h3`
  font-size: 1.2em;
  color: #24292e;
  margin-bottom: 0.5em;

  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;

const Input = styled.input`
  padding: 0.8em;
  border-radius: 4px;
  border: 1px solid #ced4da;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }

  @media (max-width: 768px) {
    font-size: 0.9em;
    padding: 0.7em;
  }
`;

const ActionButton = styled.button`
  padding: 0.8em;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s;
  width: 100%;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 0.9em;
    padding: 0.7em;
  }
`;

const DepositButton = styled(ActionButton)`
  background-color: #28a745;
  &:hover:not(:disabled) {
    background-color: #218838;
  }
`;

const WithdrawButton = styled(ActionButton)`
  background-color: #007bff;
  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffdce0;
  border: 1px solid #f97583;
  border-radius: 8px;
  padding: 1em;
  margin-top: 1em;
  color: #86181d;
  gap: 0.5em;

  @media (max-width: 768px) {
    font-size: 0.9em;
    padding: 0.8em;
  }
`;

const AccountCreationCard = styled.div`
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  padding: 1.5em;
  margin-top: 2em;

  @media (max-width: 768px) {
    padding: 1em;
  }
`;

const AccountCreationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 1em;
`;

const CountryInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
  margin: 1em 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5em;
  }
`;

const CreateAccountButton = styled(ActionButton)`
  background-color: #0366d6;
  margin-top: 1em;
  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

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
    <WalletContainer>
      <SectionTitle>
        <FaWallet /> Wallet
      </SectionTitle>
      <BalanceContainer>
        <BalanceDisplay>
          <BalanceTitle>Available Balance</BalanceTitle>
          <Balance>
            ${wallet && wallet.wallet_balance !== null ? wallet.wallet_balance.toFixed(2) : '0.00'}
          </Balance>
        </BalanceDisplay>
        <BalanceDisplay>
          <BalanceTitle>Held Balance</BalanceTitle>
          <Balance>
            ${wallet && wallet.held_balance !== null ? wallet.held_balance.toFixed(2) : '0.00'}
          </Balance>
        </BalanceDisplay>
      </BalanceContainer>
      <WalletActions>
        <WalletAction>
          <ActionTitle>Deposit Funds</ActionTitle>
          <Input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="$ Enter amount"
            min={MINIMUM_AMOUNT}
            step="0.01"
          />
          <DepositButton 
            onClick={handleDepositClick}
            disabled={isDepositing}
          >
            <FaArrowUp /> {isDepositing ? 'Processing...' : 'Deposit'}
          </DepositButton>
        </WalletAction>
        <WalletAction>
          <ActionTitle>Withdraw Funds</ActionTitle>
          <Input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="$ Enter amount"
            min={MINIMUM_AMOUNT}
            step="0.01"
          />
          <WithdrawButton 
            onClick={handleWithdrawClick}
            disabled={isWithdrawing}
          >
            <FaArrowDown /> {isWithdrawing ? 'Processing...' : 'Withdraw'}
          </WithdrawButton>
        </WalletAction>
      </WalletActions>
      {(error || localError) && (
        <ErrorMessage>
          <FaExclamationCircle />
          {localError || error}
        </ErrorMessage>
      )}
      {showAccountCreation && !localError && (
        <AccountCreationCard>
          <AccountCreationHeader>
            <FaExclamationCircle />
            <h3>Payment Account Required</h3>
          </AccountCreationHeader>
          <p>
            To withdraw funds, you need to create a payment account. This is a one-time process that enables secure withdrawals to your bank account. If you've already created an account, you may need to recreate it.
          </p>
          <CountryInputContainer>
            <label>Country:</label>
            <Input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value.toUpperCase())}
              placeholder="Enter code (e.g., US)"
              maxLength={2}
            />
          </CountryInputContainer>
          <CreateAccountButton
            onClick={handleCreatePaymentAccount}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Create Payment Account'}
          </CreateAccountButton>
        </AccountCreationCard>
      )}
    </WalletContainer>
  );
};

export default WalletSection;