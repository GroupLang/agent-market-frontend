import styled from 'styled-components';

const TableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 16px;

  /* Responsive adjustments */
  @media (max-width: 768px) {
    max-height: none;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  padding: 32px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  gap: 24px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-start;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

  @media (min-width: 768px) {
    width: calc(33.33% - 16px);
    margin-right: 0;
  }
`;

const FullWidthInputGroup = styled(InputGroup)`
  width: 100%;
  padding-left: 0;
`;

const Input = styled.input`
  width: 96%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;

  ${FullWidthInputGroup} & {
    width: 92%;
  }
`;

const CreateButton = styled.button`
  width: 100%;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 28px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
  margin-top: 24px;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(76, 175, 80, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
  }

  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const FormTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const InstanceList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const InstanceItem = styled.li`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InstanceInfo = styled.span`
  color: #555;
  &:not(:last-child) {
    margin-right: 16px;
  }
`;

const InstanceId = styled.span`
  font-weight: bold;
  color: #007bff;
`;

const SelectedInstancesSection = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SelectedInstancesTitle = styled.h3`
  font-size: 20px;
  color: #333;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 8px;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const SectionSpacer = styled.div`
  margin-top: 32px;
  margin-bottom: 32px;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  svg {
    font-size: 16px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTableHeader = styled.th`
  padding: 12px 16px;
  background-color: #f9f9f9;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const StyledTableRow = styled.tr`
  background-color: ${({ index }) => (index % 2 === 0 ? '#ffffff' : '#f1f1f1')};
  transition: background-color 0.3s;

  &:hover {
    background-color: #e6f7ff;
  }
`;

const StyledTableData = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
`;

/* Modal Styles */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  margin: 10% auto;
  text-align: center;

  h3 {
    margin-bottom: 20px;
    color: #333;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
      color: #555;
    }
  }

  button {
    margin-top: 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #45a049;
    }
  }
`;

const StyledSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  background-color: #ffffff;
  color: #333;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:hover {
    border-color: #4CAF50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const styles = {
  apiKeyControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    padding: '8px 12px',
  },
  searchIcon: {
    marginRight: '8px',
    color: '#666',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    fontSize: '14px',
    width: '200px',
  },
  tableHeader: {
    cursor: 'pointer',
    userSelect: 'none',
    textAlign: 'left',
  },
  sortIcon: {
    marginLeft: '4px',
    fontSize: '12px',
  },
  tableCell: {
    fontSize: '14px',
    textAlign: 'left',
  },
  centerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: '#e0f2f1',
    color: '#00897b',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',

    ':hover': {
      backgroundColor: '#45a049',
    },
  },
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    margin: 'auto',
    marginTop: '10%',
    textAlign: 'center'
  }
};

const InstanceCountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-left: 8px;
  transition: color 0.3s ease;

  &:hover {
    color: #007BFF;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export {
  TableContainer,
  FormContainer,
  InputRow,
  InputGroup,
  FullWidthInputGroup,
  Input,
  CreateButton,
  FormTitle,
  Label,
  InstanceList,
  InstanceItem,
  InstanceInfo,
  InstanceId,
  SelectedInstancesSection,
  SelectedInstancesTitle,
  ErrorMessage,
  PageContainer,
  ContentContainer,
  SectionSpacer,
  RefreshButton,
  StyledTable,
  StyledTableHeader,
  StyledTableRow,
  StyledTableData,
  ModalOverlay,
  ModalContent,
  StyledSelect,
  styles,
  modalStyles,
  InstanceCountBadge,
};
