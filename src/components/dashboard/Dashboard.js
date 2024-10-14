import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import UserInfoSection from './UserInfoSection';
import WalletSection from './WalletSection';
import ApiKeySection from './ApiKeySection';
import ApiKeyModal from '../modals/ApiKeyModal';
import InstancesSection from '../instances/Instances';
import ChatSection from '../chat/ChatSection';
import { styles } from '../styles/DashboardStyles';
import { logout, fetchUserData } from '../../redux/actions/authActions';
import { fetchApiKeys, createApiKey, deleteApiKey, toggleApiKey } from '../../redux/actions/apiKeyActions';
import { fetchWalletBalance, createDeposit, createWithdrawal, createPaymentAccount } from '../../redux/actions/walletActions';

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
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <Header handleLogout={handleLogout} />
      <div style={styles.content}>
        <div style={styles.tabContainer}>
          {['dashboard', 'instances', 'chat'].map((tab) => (
            <button
              key={tab}
              style={activeTab === tab ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <>
            <UserInfoSection userData={userData} />
            <div style={styles.sectionSeparator}>
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
            </div>
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
      </div>
      <Footer />
      <ApiKeyModal 
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        newApiKey={newApiKey}
        handleCopyClick={handleCopyClick}
        copySuccess={copySuccess}
      />
    </div>
  );
};

export default Dashboard;