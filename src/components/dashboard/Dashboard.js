import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import UserInfoSection from './UserInfoSection';
import WalletSection from './WalletSection';
import ApiKeySection from './ApiKeySection';
import ApiKeyModal from '../modals/ApiKeyModal';
import InstancesSection from '../instances/Instances';
import ChatSection from '../chat/ChatSection';
import { logout, fetchUserData } from '../../redux/actions/authActions';
import { fetchApiKeys, createApiKey, deleteApiKey, toggleApiKey } from '../../redux/actions/apiKeyActions';
import { fetchWalletBalance, createDeposit, createWithdrawal, createPaymentAccount } from '../../redux/actions/walletActions';

const Container = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1em;
  background-color: #f6f8fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 0 0.5em;
  }
`;

const Content = styled.div`
  flex: 1;
  padding-top: 2em;

  @media (max-width: 768px) {
    padding-top: 1em;
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e1e4e8;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    margin: 0 -0.5em 1.5rem -0.5em;
    padding: 0 0.5em;
  }
`;

const TabButton = styled.button`
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: ${props => props.$active ? '#0366d6' : '#586069'};
  font-weight: ${props => props.$active ? '600' : '400'};
  border-bottom: 2px solid ${props => props.$active ? '#0366d6' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    color: #0366d6;
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5em;
  color: #586069;
`;

const SectionSeparator = styled.div`
  margin-bottom: 2em;
`;

const Dashboard = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { token: authToken, isAuthenticated } = useSelector(state => state.auth);
  const apiKeys = useSelector(state => state.apiKeys.keys);
  const wallet = useSelector(state => state.wallet);
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState({ api_key: '', name: '', is_live: false });
  const [copySuccess, setCopySuccess] = useState(false);

  // API Key state
  const [apiKeyState, setApiKeyState] = useState({
    newKeyName: '',
    isLive: true,
    searchTerm: '',
    sortField: 'name',
    sortDirection: 'asc',
    currentPage: 1,
    isCreatingKey: false,
    isTogglingKey: false,
    isDeletingKey: false
  });

  // Wallet state
  const [walletState, setWalletState] = useState({
    depositAmount: '',
    withdrawAmount: '',
    isDepositing: false,
    isWithdrawing: false,
    showAccountCreation: false
  });

  // Tab state
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'dashboard');

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const itemsPerPage = 5;

  useEffect(() => {
    if (!isAuthenticated || !authToken) {
      history.push('/login');
    } else {
      dispatch(fetchUserData())
        .then(data => setUserData(data))
        .catch(() => {
          dispatch(logout());
          history.push('/login');
        })
        .finally(() => setLoading(false));
      dispatch(fetchApiKeys());
      dispatch(fetchWalletBalance());
    }
  }, [isAuthenticated, authToken, history, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    history.push('/login');
  };

  // API Key functions
  const handleCreateApiKey = async () => {
    if (!apiKeyState.newKeyName.trim()) {
      toast.error('Please enter a valid API key name');
      return;
    }
    setApiKeyState(prev => ({ ...prev, isCreatingKey: true }));
    try {
      const createdKey = await dispatch(createApiKey(apiKeyState.newKeyName, apiKeyState.isLive));
      setApiKeyState(prev => ({ ...prev, newKeyName: '' }));
      setNewApiKey(createdKey);
      setIsModalOpen(true);
      toast.success('API key created successfully');
    } catch (error) {
      toast.error('Failed to create API key: ' + error.message);
    } finally {
      setApiKeyState(prev => ({ ...prev, isCreatingKey: false }));
    }
  };

  const handleDeleteApiKey = async (name) => {
    setApiKeyState(prev => ({ ...prev, isDeletingKey: true }));
    try {
      await dispatch(deleteApiKey(name));
      toast.success('API key deleted successfully');
    } catch (error) {
      toast.error('Failed to delete API key: ' + error.message);
    } finally {
      setApiKeyState(prev => ({ ...prev, isDeletingKey: false }));
    }
  };

  const handleToggleApiKey = async (name, currentStatus) => {
    setApiKeyState(prev => ({ ...prev, isTogglingKey: true }));
    try {
      await dispatch(toggleApiKey(name, !currentStatus));
      toast.success(`API key ${currentStatus ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      toast.error('Failed to toggle API key: ' + error.message);
    } finally {
      setApiKeyState(prev => ({ ...prev, isTogglingKey: false }));
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(newApiKey.api_key).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleSort = (field) => {
    setApiKeyState(prev => ({
      ...prev,
      sortDirection: field === prev.sortField && prev.sortDirection === 'asc' ? 'desc' : 'asc',
      sortField: field
    }));
  };

  // Wallet functions
  const handleDeposit = async (amount) => {
    setWalletState(prev => ({ ...prev, isDepositing: true }));
    try {
      const result = await dispatch(createDeposit(amount));
      if (result.url) {
        window.open(result.url, '_blank');
      }
    } catch (error) {
      toast.error('Failed to initiate deposit: ' + error.message);
    } finally {
      setWalletState(prev => ({ ...prev, isDepositing: false }));
    }
  };

  const handleWithdraw = async (amount) => {
    setWalletState(prev => ({ ...prev, isWithdrawing: true }));
    try {
      await dispatch(createWithdrawal(parseFloat(amount)));
      toast.success('Withdrawal initiated successfully');
      setWalletState(prev => ({ ...prev, withdrawAmount: '' }));
      dispatch(fetchWalletBalance());
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.detail.includes("Stripe account not found")) {
        setWalletState(prev => ({ ...prev, showAccountCreation: true }));
      } else {
        toast.error('Failed to initiate withdrawal: ' + error.message);
      }
    } finally {
      setWalletState(prev => ({ ...prev, isWithdrawing: false }));
    }
  };

  const handleCreatePaymentAccount = async (country) => {
    try {
      await dispatch(createPaymentAccount(country));
      setWalletState(prev => ({ ...prev, showAccountCreation: false }));
      toast.success('Payment account created successfully. You can now withdraw funds.');
    } catch (error) {
      toast.error('Failed to create payment account: ' + error.message);
    }
  };

  const sortedAndFilteredKeys = apiKeys
    .filter(key => key.name.toLowerCase().includes(apiKeyState.searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a[apiKeyState.sortField] < b[apiKeyState.sortField]) return apiKeyState.sortDirection === 'asc' ? -1 : 1;
      if (a[apiKeyState.sortField] > b[apiKeyState.sortField]) return apiKeyState.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const paginatedKeys = sortedAndFilteredKeys.slice(
    (apiKeyState.currentPage - 1) * itemsPerPage,
    apiKeyState.currentPage * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(sortedAndFilteredKeys.length / itemsPerPage));

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  return (
    <Container>
      <Header handleLogout={handleLogout} />
      <Content>
        <TabContainer>
          {['dashboard', 'instances', 'chat'].map((tab) => (
            <TabButton
              key={tab}
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabButton>
          ))}
        </TabContainer>

        {activeTab === 'dashboard' && (
          <>
            <UserInfoSection userData={userData} />
            <SectionSeparator>
              <ApiKeySection 
                {...apiKeyState}
                setSearchTerm={(searchTerm) => setApiKeyState(prev => ({ ...prev, searchTerm }))}
                setNewKeyName={(newKeyName) => setApiKeyState(prev => ({ ...prev, newKeyName }))}
                setIsLive={(isLive) => setApiKeyState(prev => ({ ...prev, isLive }))}
                handleCreateApiKey={handleCreateApiKey}
                paginatedKeys={paginatedKeys}
                handleToggleApiKey={handleToggleApiKey}
                handleDeleteApiKey={handleDeleteApiKey}
                setCurrentPage={(currentPage) => setApiKeyState(prev => ({ ...prev, currentPage }))}
                totalPages={totalPages}
                handleSort={handleSort}
              />
            </SectionSeparator>
            <WalletSection 
              wallet={wallet}
              {...walletState}
              setDepositAmount={(depositAmount) => setWalletState(prev => ({ ...prev, depositAmount }))}
              setWithdrawAmount={(withdrawAmount) => setWalletState(prev => ({ ...prev, withdrawAmount }))}
              handleDeposit={handleDeposit}
              handleWithdraw={handleWithdraw}
              handleCreatePaymentAccount={handleCreatePaymentAccount}
            />
          </>
        )}
        {activeTab === 'instances' && <InstancesSection />}
        {activeTab === 'chat' && <ChatSection />}
      </Content>
      <Footer />
      <ApiKeyModal 
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        newApiKey={newApiKey}
        handleCopyClick={handleCopyClick}
        copySuccess={copySuccess}
      />
    </Container>
  );
};

export default Dashboard;