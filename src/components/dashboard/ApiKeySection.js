import React, { useState } from 'react';
import { StyledTable, StyledTableRow, styles } from '../styles/DashboardStyles';
import { FaSearch, FaSort, FaToggleOn, FaToggleOff, FaTrash, FaChevronLeft, FaChevronRight, FaKey, FaCheck } from 'react-icons/fa';

const CustomCheckbox = ({ checked, onChange, label, disabled }) => (
  <label style={styles.checkboxContainer}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      style={styles.hiddenCheckbox}
    />
    <div
      style={{
        ...styles.styledCheckbox,
        ...(checked ? styles.styledCheckboxChecked : {}),
      }}
    >
      {checked && <FaCheck size={12} />}
    </div>
    <span>{label}</span>
  </label>
);

const ApiKeySection = ({
  searchTerm, 
  setSearchTerm, 
  newKeyName, 
  setNewKeyName, 
  isLive, 
  setIsLive, 
  handleCreateApiKey, 
  isCreatingKey, 
  paginatedKeys, 
  handleToggleApiKey, 
  handleDeleteApiKey, 
  isTogglingKey, 
  isDeletingKey, 
  currentPage, 
  setCurrentPage, 
  totalPages, 
  handleSort 
}) => (
  <section style={styles.apiKeySection}>
    <h2 style={styles.sectionTitle}>
      <FaKey /> API Keys
    </h2>
    <div style={styles.apiKeyControls}>
      <div style={styles.searchBar}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search API keys..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      <div style={styles.createKeyForm}>
        <input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="New API Key Name"
          style={styles.input}
          disabled={isCreatingKey}
        />
        <CustomCheckbox
          checked={isLive}
          onChange={(e) => setIsLive(e.target.checked)}
          label="Is Live"
          disabled={isCreatingKey}
        />
        <button 
          onClick={handleCreateApiKey} 
          style={styles.createBtn}
          disabled={isCreatingKey}
        >
          {isCreatingKey ? 'Creating...' : 'Create API Key'}
        </button>
      </div>
    </div>

    <div style={styles.tableContainer}>
      <StyledTable>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} style={styles.tableHeader}>
              Name <FaSort style={styles.sortIcon} />
            </th>
            <th onClick={() => handleSort('is_live')} style={styles.tableHeader}>
              Status <FaSort style={styles.sortIcon} />
            </th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedKeys.map((key) => (
            <tr key={key.name} style={styles.tableRow}>
              <td style={styles.tableCell}>{key.name}</td>
              <td style={styles.tableCell}>
                <div style={styles.centerContent}>
                  <span style={key.is_live ? styles.liveStatus : styles.disabledStatus}>
                    {key.is_live ? 'Live' : 'Disabled'}
                  </span>
                </div>
              </td>
              <td style={styles.tableCell}>
                <div style={styles.centerContent}>
                  <button
                    onClick={() => handleToggleApiKey(key.name, key.is_live)}
                    style={key.is_live ? styles.disableBtn : styles.enableBtn}
                    disabled={isTogglingKey || isDeletingKey}
                  >
                    {key.is_live ? <FaToggleOn /> : <FaToggleOff />}
                    {isTogglingKey ? 'Updating...' : key.is_live ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDeleteApiKey(key.name)}
                    style={styles.deleteBtn}
                    disabled={isTogglingKey || isDeletingKey}
                  >
                    <FaTrash /> {isDeletingKey ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </div>

    <div style={styles.pagination}>
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        style={styles.paginationBtn}
      >
        <FaChevronLeft />
      </button>
      <span style={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        style={styles.paginationBtn}
      >
        <FaChevronRight />
      </button>
    </div>
  </section>
);

export default ApiKeySection;
