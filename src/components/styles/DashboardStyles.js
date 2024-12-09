import styled from 'styled-components';

export const DashboardContainer = styled.div`
  font-family: 'Inter', sans-serif;
  background-color: #f7f9fc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const TabContainer = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

export const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  background-color: ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#4a5568'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#0056b3' : '#e2e8f0'};
  }
`;

export const Section = styled.section`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

export const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: #f7fafc;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
`;

export const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

export const Tr = styled.tr`
  &:hover {
    background-color: #f7fafc;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
    cursor: pointer;
  }

  tr:nth-of-type(even) {
    background-color: #f2f2f2;
  }
`;

export const StyledTableRow = styled.tr`
  &:nth-of-type(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    background-color: #e9ecef;
  }
`;

export const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1em',
    backgroundColor: '#f6f8fa',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 768px)': {
      padding: '0 0.5em',
    },
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1em 0',
    borderBottom: '1px solid #e1e4e8',
    '@media (max-width: 768px)': {
      padding: '0.5em 0',
      flexDirection: 'column',
      gap: '0.5em',
    },
  },
  logo: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: '#24292e',
  },
  content: {
    flex: 1,
    paddingTop: '2em',
    '@media (max-width: 768px)': {
      paddingTop: '1em',
    },
  },
  title: {
    fontSize: '2em',
    color: '#24292e',
    marginBottom: '0.5em',
  },
  breadcrumbs: {
    color: '#586069',
    fontSize: '0.9em',
  },
  userInfoSection: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '2em',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    marginBottom: '2em',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      padding: '1em',
      textAlign: 'center',
    },
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#2da44e',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '2em',
    '@media (max-width: 768px)': {
      marginRight: '0',
      marginBottom: '1em',
    },
  },
  userInfo: {
    '& h2': {
      margin: '0 0 0.5em 0',
      color: '#24292e',
    },
    '& p': {
      margin: '0.25em 0',
      color: '#586069',
    },
  },
  walletSection: {
    backgroundColor: '#ffffff',
    padding: '2em',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    marginBottom: '2em',
    '@media (max-width: 768px)': {
      padding: '1em',
    },
  },
  sectionTitle: {
    fontSize: '1.5em',
    color: '#24292e',
    marginBottom: '1em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em',
  },
  balanceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '2em',
    marginBottom: '2em',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '1em',
    },
  },
  balanceDisplay: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: '1.5em',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  balanceTitle: {
    fontSize: '1em',
    color: '#6c757d',
    marginBottom: '0.5em',
  },
  balance: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    color: '#24292e',
  },
  walletActions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '2em',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '1em',
    },
  },
  walletAction: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  actionTitle: {
    fontSize: '1.2em',
    color: '#24292e',
    marginBottom: '0.5em',
  },
  input: {
    padding: '0.8em',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '1em',
  },
  actionBtn: {
    padding: '0.8em',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5em',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  depositBtn: {
    backgroundColor: '#28a745',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
  withdrawBtn: {
    backgroundColor: '#007bff',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  apiKeySection: {
    backgroundColor: '#ffffff',
    padding: '2em',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  },
  apiKeyControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    marginBottom: '1em',
  },
  searchBar: {
    position: 'relative',
    width: '95%',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#586069',
  },
  searchInput: {
    width: '100%',
    padding: '0.5em 0.5em 0.5em 2.5em',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '0.9em',
  },
  createKeyForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '1em',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em',
  },
  createBtn: {
    padding: '0.5em 1em',
    backgroundColor: '#2da44e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tableContainer: {
    overflowX: 'auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    marginBottom: '1em',
    '@media (max-width: 768px)': {
      fontSize: '0.9em',
    },
  },
  tableHeader: {
    textAlign: 'center',
    padding: '1em',
    backgroundColor: '#f1f3f5',
    color: '#495057',
    fontWeight: 'bold',
    borderBottom: '2px solid #e9ecef',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  sortIcon: {
    marginLeft: '0.5em',
    fontSize: '0.8em',
  },
  tableRow: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f8f9fa',
    },
    '&:hover': {
      backgroundColor: '#e9ecef',
    },
  },
  tableCell: {
    padding: '1em',
    borderBottom: '1px solid #e9ecef',
    textAlign: 'center',
  },
  centerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5em',
  },
  liveStatus: {
    color: '#2da44e',
    fontWeight: 'bold',
    backgroundColor: '#dcffe4',
    padding: '0.3em 0.6em',
    borderRadius: '20px',
    fontSize: '0.9em',
    display: 'inline-block',
  },
  disabledStatus: {
    color: '#d73a49',
    fontWeight: 'bold',
    backgroundColor: '#ffdce0',
    padding: '0.3em 0.6em',
    borderRadius: '20px',
    fontSize: '0.9em',
    display: 'inline-block',
  },
  enableBtn: {
    padding: '0.5em 1em',
    backgroundColor: '#2da44e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5em',
    transition: 'background-color 0.3s',
  },
  disableBtn: {
    padding: '0.5em 1em',
    backgroundColor: '#d73a49',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5em',
    transition: 'background-color 0.3s',
  },
  deleteBtn: {
    padding: '0.5em 1em',
    backgroundColor: '#6a737d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5em',
    transition: 'background-color 0.3s',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1em',
  },
  paginationBtn: {
    padding: '0.5em 1em',
    backgroundColor: '#f1f3f5',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  pageInfo: {
    margin: '0 1em',
    color: '#495057',
  },
  footer: {
    borderTop: '1px solid #e1e4e8',
    marginTop: '2em',
    padding: '1em 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9em',
    color: '#586069',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '1em',
      textAlign: 'center',
    },
  },
  footerLink: {
    color: '#0366d6',
    textDecoration: 'none',
    marginLeft: '1em',
  },
  logoutBtn: {
    padding: '0.5em 1em',
    backgroundColor: '#d73a49',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
  },
  modal: {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '90%',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      '@media (max-width: 768px)': {
        width: '95%',
        padding: '15px',
      },
    },
  },
  modalTitle: {
    fontSize: '1.5em',
    marginBottom: '15px',
    color: '#24292e',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  modalText: {
    marginBottom: '10px',
    color: '#586069',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  apiKeyContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  },
  apiKeyDisplay: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    padding: '15px',
    borderRadius: '6px 0 0 6px',
    wordBreak: 'break-all',
    border: '1px solid #e1e4e8',
    fontSize: '0.9em',
    color: '#24292e',
    margin: 0,
  },
  copyButton: {
    padding: '15px',
    backgroundColor: '#0366d6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0 6px 6px 0',
    cursor: 'pointer',
    fontSize: '0.9em',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  modalInfo: {
    marginBottom: '20px',
  },
  modalCloseBtn: {
    padding: '10px 20px',
    backgroundColor: '#0366d6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
  },
  depositBtn: {
    padding: '0.5em 1em',
    backgroundColor: '#2da44e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em',
  },
  withdrawBtn: {
    padding: '0.5em 1em',
    backgroundColor: '#0366d6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5em',
    color: '#586069',
  },
  sectionSeparator: {
    marginBottom: '2em',
  },
  accountCreationMessage: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
    borderRadius: '8px',
    padding: '1em',
    marginTop: '1em',
  },
  accountCreationIcon: {
    marginRight: '1em',
  },
  accountCreationContent: {
    flex: 1,
  },
  accountCreationText: {
    color: '#856404',
    marginBottom: '0.5em',
  },
  createAccountBtn: {
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5em 1em',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#e0a800',
    },
  },
  paymentAccountCreation: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '1em',
    borderRadius: '8px',
    marginTop: '1em',
  },
  paymentAccountLink: {
    color: '#155724',
    fontWeight: 'bold',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  accountCreationCard: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
    borderRadius: '8px',
    padding: '1.5em',
    marginTop: '2em',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  accountCreationHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1em',
  },
  accountCreationTitle: {
    color: '#856404',
    fontSize: '1.2em',
    fontWeight: 'bold',
    marginLeft: '0.5em',
  },
  accountCreationText: {
    color: '#856404',
    marginBottom: '1em',
    lineHeight: '1.5',
  },
  createAccountBtn: {
    backgroundColor: '#0366d6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.8em 1.2em',
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.1s',
    '&:hover': {
      backgroundColor: '#0056b3',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  paymentAccountCreation: {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '8px',
    padding: '1.5em',
    marginTop: '2em',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  paymentAccountHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1em',
  },
  paymentAccountTitle: {
    color: '#155724',
    fontSize: '1.2em',
    fontWeight: 'bold',
    marginLeft: '0.5em',
  },
  paymentAccountText: {
    color: '#155724',
    marginBottom: '1em',
    lineHeight: '1.5',
  },
  paymentAccountLink: {
    display: 'inline-block',
    backgroundColor: '#0366d6',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '0.8em 1.2em',
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, transform 0.1s',
    '&:hover': {
      backgroundColor: '#0056b3',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  countryInputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1em',
  },
  countryInputLabel: {
    marginRight: '1em',
    color: '#856404',
    fontWeight: 'bold',
  },
  countryInput: {
    flex: 1,
    padding: '0.8em',
    borderRadius: '4px',
    border: '1px solid #ffeeba',
    fontSize: '1em',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffdce0',
    border: '1px solid #f97583',
    borderRadius: '8px',
    padding: '1em',
    marginTop: '1em',
    color: '#86181d',
  },
  errorIcon: {
    marginRight: '0.5em',
    fontSize: '1.2em',
  },
  closeErrorBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    color: '#86181d',
    fontSize: '1.2em',
    cursor: 'pointer',
  },
  tabContainer: {
    display: 'flex',
    marginBottom: '2rem',
    borderBottom: '1px solid #e0e0e0',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '0.5em',
    },
  },
  tab: {
    padding: '1rem 2rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#666',
    transition: 'all 0.3s ease',
    borderBottom: '3px solid transparent',
    '@media (max-width: 768px)': {
      padding: '0.5rem 1rem',
      width: '100%',
      textAlign: 'center',
    },
  },
  activeTab: {
    padding: '1rem 2rem',
    border: 'none',
    borderBottom: '3px solid #007bff',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#007bff',
    fontWeight: 'bold',
    '@media (max-width: 768px)': {
      padding: '0.5rem 1rem',
      width: '100%',
      textAlign: 'center',
    },
  },
  dashboardContent: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  dashboardSection: {
    // Add any specific styles for the dashboard section
  },
  chatSection: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 200px)', // Adjust based on your layout
    width: '100%',
  },
  chatContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
    maxWidth: '70%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: '12px 16px',
    borderRadius: '18px',
    wordWrap: 'break-word',
    maxWidth: '100%',
  },
  userMessageBubble: {
    backgroundColor: '#007bff',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  aiMessageBubble: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    borderBottomLeftRadius: '4px',
  },
  messageTime: {
    fontSize: '0.75rem',
    color: '#888',
    marginTop: '4px',
    alignSelf: 'flex-end',
  },
  loadingIndicator: {
    alignSelf: 'center',
    color: '#666',
    margin: '10px 0',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ddd',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    marginRight: '10px',
  },
  sendButton: {
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  '@media (max-width: 768px)': {
    dashboardContent: {
      flexDirection: 'column',
    },
    // Add any other responsive styles here
  },
};

export default styles;