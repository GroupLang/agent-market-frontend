import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { FaSearch, FaSort, FaSync, FaPlus } from 'react-icons/fa';
import GitHubIntegration from './GitHubIntegration';
import {
  TableContainer,
  FormContainer,
  InputRow,
  InputGroup,
  FullWidthInputGroup,
  Input,
  CreateButton,
  FormTitle,
  Label,
  SelectedInstancesSection,
  SelectedInstancesTitle,
  ErrorMessage,
  PageContainer,
  ContentContainer,
  SectionSpacer,
  RefreshButton,
  StyledTable,
  StyledTableRow,
  StyledTableHeader,
  StyledTableData,
  ModalOverlay,
  ModalContent,
  StyledSelect,
  InstanceCountBadge,
  styles,
} from '../styles/InstanceStyles';
import { fetchInstances, createInstance, fetchInvolvedProviders } from '../../redux/actions/instanceActions';
import { Modal } from '@mui/material';
import { Button } from '@mui/material';
import { Upcoming } from '@mui/icons-material';

const Instances = () => {
  const dispatch = useDispatch();
  const { instances, error, creatingInstance } = useSelector(state => state.instances);
  const { token: authToken } = useSelector(state => state.auth);
  const [showProvidersModal, setShowProvidersModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [instanceParams, setInstanceParams] = useState({
    model: 'gpt-3.5-turbo',
    background: '',
    max_credit_per_instance: 1,
    instance_timeout: 60,
    gen_reward_timeout: 2000,
    percentage_reward: 1,
    prompt_template: '',
    representative_agent: false,
  });

  useEffect(() => {
    // Update page title when component mounts
    const event = new CustomEvent('updatePageTitle', {
      detail: { section: 'instances' }
    });
    window.dispatchEvent(event);
  }, []);

  useEffect(() => {
    dispatch(fetchInstances(authToken));
  }, [dispatch, authToken]);

  const handleCreateInstance = (e) => {
    e.preventDefault();
    dispatch(createInstance(authToken, instanceParams));
    if (!error) {
      setShowCreateModal(false);
    }
  };

  const handleParamChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInstanceParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
              name === 'max_credit_per_instance' ? parseFloat(value) : 
              name === 'background' ? value :
              parseInt(value, 10)
    }));
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const renderSelectedInstances = () => {
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return 'Invalid Date';
        }
        return format(date, 'MMM d, yyyy h:mm a');
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
      }
    };

    const handleStatusChange = (event) => {
      const newStatus = event.target.value;
      setSelectedStatus(newStatus);
      dispatch(fetchInstances(authToken, newStatus));
    };

    const statusLabels = {
      0: 'Open',
      3: 'Resolved',
      5: 'Failed',
      7: 'Finalized'
    };

    const filteredInstances = instances.filter(instance =>
      instance.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedInstances = [...filteredInstances].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
  
      if (typeof valueA === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number') {
        return sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      } else if (valueA instanceof Date || !isNaN(Date.parse(valueA))) {
        return sortDirection === 'asc'
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }
      return 0;
    });

    const handleShowProviders = async (instanceId) => {
      try {
        const response = await dispatch(fetchInvolvedProviders(authToken, instanceId));
        if (response) {
          setProviders(response);
          setShowProvidersModal(true);
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      }
    };

    return (
      <SelectedInstancesSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <SelectedInstancesTitle>
            <StyledSelect
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              {Object.keys(statusLabels).map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]} Instances
                </option>
              ))}
            </StyledSelect>
            <InstanceCountBadge>({filteredInstances.length})</InstanceCountBadge>
          </SelectedInstancesTitle>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button
              variant="text"
              startIcon={<FaPlus style={{ fontSize: '0.75rem' }} />}
              onClick={() => setShowCreateModal(true)}
              sx={{ 
                fontSize: '0.875rem',
                padding: '8px 12px',
                color: '#666',
                backgroundColor: 'transparent',
                textTransform: 'none',
                minWidth: 'auto',
                height: '32px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#333'
                }
              }}
            >
              New
            </Button>
            <RefreshButton onClick={() => dispatch(fetchInstances(authToken, selectedStatus))}>
              <FaSync /> Refresh
            </RefreshButton>
          </div>
        </div>
        <div style={styles.apiKeyControls}>
          <div style={styles.searchBar}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search instances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <StyledTableHeader onClick={() => handleSort('id')} style={styles.tableHeader}>
                  ID <FaSort style={styles.sortIcon} />
                </StyledTableHeader>
                <StyledTableHeader onClick={() => handleSort('max_credit_per_instance')} style={styles.tableHeader}>
                  Max Credit <FaSort style={styles.sortIcon} />
                </StyledTableHeader>
                <StyledTableHeader onClick={() => handleSort('creation_date')} style={styles.tableHeader}>
                  Creation Date <FaSort style={styles.sortIcon} />
                </StyledTableHeader>
                <StyledTableHeader onClick={() => handleSort('instance_timeout_datetime')} style={styles.tableHeader}>
                  Instance Timeout <FaSort style={styles.sortIcon} />
                </StyledTableHeader>
                <StyledTableHeader onClick={() => handleSort('gen_reward_timeout_datetime')} style={styles.tableHeader}>
                  Gen Reward Timeout <FaSort style={styles.sortIcon} />
                </StyledTableHeader>
                {(selectedStatus === '3' || selectedStatus === '7') && (
                  <StyledTableHeader style={styles.tableHeader}>
                    Providers
                  </StyledTableHeader>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedInstances.map((instance, index) => (
                <StyledTableRow key={instance.id} index={index}>
                  <StyledTableData style={styles.tableCell}>{instance.id.slice(0, 8)}...</StyledTableData>
                  <StyledTableData style={styles.tableCell}>
                    ${(instance.max_credit_per_instance).toFixed(2)}
                  </StyledTableData>
                  <StyledTableData style={styles.tableCell}>
                    {formatDate(instance.creation_date)} (UTC)
                  </StyledTableData>
                  <StyledTableData style={styles.tableCell}>
                    {formatDate(instance.instance_timeout_datetime)} (UTC)
                  </StyledTableData>
                  <StyledTableData style={styles.tableCell}>
                    {formatDate(instance.gen_reward_timeout_datetime)} (UTC)
                  </StyledTableData>
                  {(selectedStatus === '3' || selectedStatus === '7') && (
                    <StyledTableData style={styles.tableCell}>
                      <button onClick={() => handleShowProviders(instance.id)} style={styles.button}>
                        Show
                      </button>
                    </StyledTableData>
                  )}
                </StyledTableRow>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>

        {showProvidersModal && (
          <ModalOverlay>
            <ModalContent>
              <h3>Involved Providers</h3>
              <ul>
                {providers.length > 0 ? (
                  providers.map((provider) => (
                    <li key={provider}>{provider}</li>
                  ))
                ) : (
                  <li>No providers available</li>
                )}
              </ul>
              <button onClick={() => setShowProvidersModal(false)}>Close</button>
            </ModalContent>
          </ModalOverlay>
        )}
      </SelectedInstancesSection>
    );
  };

  const renderInstanceForm = () => (
    <FormContainer onSubmit={handleCreateInstance}>
      <FormTitle>Create New Instance</FormTitle>
      <InputRow>
        <InputGroup>
          <Label htmlFor="max_credit_per_instance">Max Credit ($)</Label>
          <Input
            id="max_credit_per_instance"
            type="number"
            name="max_credit_per_instance"
            value={instanceParams.max_credit_per_instance}
            onChange={handleParamChange}
            placeholder="0.01"
            step="0.01"
            min="0"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="instance_timeout">Instance Lifespan (sec)</Label>
          <Input
            id="instance_timeout"
            type="number"
            name="instance_timeout"
            value={instanceParams.instance_timeout}
            onChange={handleParamChange}
            placeholder="60"
            min="1"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="gen_reward_timeout">Reward Lifespan (sec)</Label>
          <Input
            id="gen_reward_timeout"
            type="number"
            name="gen_reward_timeout"
            value={instanceParams.gen_reward_timeout}
            onChange={handleParamChange}
            placeholder="2000"
            min="1"
            required
          />
        </InputGroup>
      </InputRow>
      <FullWidthInputGroup>
        <Label htmlFor="background">Background</Label>
        <Input
          id="background"
          type="text"
          name="background"
          value={instanceParams.background}
          onChange={handleParamChange}
          placeholder="Enter background..."
          required
        />
      </FullWidthInputGroup>
      <FullWidthInputGroup>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginTop: '8px'
        }}>
          <input
            type="checkbox"
            id="representative_agent"
            name="representative_agent"
            checked={instanceParams.representative_agent}
            onChange={handleParamChange}
            style={{ 
              width: '16px',
              height: '16px',
              marginRight: '8px',
              cursor: 'pointer'
            }}
          />
          <Label 
            htmlFor="representative_agent" 
            style={{ 
              margin: 0,
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Add representative agent
          </Label>
        </div>
      </FullWidthInputGroup>
      <CreateButton type="submit" disabled={creatingInstance}>
        {creatingInstance ? 'Creating...' : 'Create Instance'}
      </CreateButton>
    </FormContainer>
  );

  return (
    <PageContainer>
      <ContentContainer>
        {/* GitHub Integration Section */}
        <GitHubIntegration />
        
        <SectionSpacer />

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {renderSelectedInstances()}

        <Modal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          aria-labelledby="create-instance-modal"
          aria-describedby="modal-to-create-new-instance"
        >
          <ModalContent>
            {renderInstanceForm()}
          </ModalContent>
        </Modal>
      </ContentContainer>
    </PageContainer>
  );
};

export default Instances;