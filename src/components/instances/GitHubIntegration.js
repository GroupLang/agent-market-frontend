import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addRepository,
  fetchRepositories,
  removeRepository
} from '../../redux/actions/instanceActions';
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Grid,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const GitHubIntegration = () => {
  const dispatch = useDispatch();
  const [repoUrl, setRepoUrl] = useState('');
  const [defaultReward, setDefaultReward] = useState('0.0');
  
  const { repositories, repositoryLoading, repositoryError } = useSelector(state => state.instances);
  const { token: authToken } = useSelector(state => state.auth);

  useEffect(() => {
    if (authToken) {
      dispatch(fetchRepositories(authToken));
    }
  }, [dispatch, authToken]);

  const handleAddRepository = (e) => {
    e.preventDefault();
    if (repoUrl && defaultReward && authToken) {
      dispatch(addRepository(authToken, repoUrl, parseFloat(defaultReward)));
      setRepoUrl('');
      setDefaultReward('0.0');
    }
  };

  const handleRemoveRepository = (repoUrl) => {
    if (authToken) {
      dispatch(removeRepository(authToken, repoUrl));
    }
  };

  if (repositoryLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontWeight: 500, mb: 3 }}>
        GitHub Repository Integration
      </Typography>

      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="body1" gutterBottom sx={{ mb: 2, color: '#444', fontWeight: 500 }}>
          Add your GitHub repositories to have their issues automatically converted into instances. 
          For each repository you add:
        </Typography>
        <Box sx={{ pl: 2, mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1.5, color: '#666', display: 'flex', alignItems: 'center' }}>
            • All open issues will be converted into instances
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5, color: '#666', display: 'flex', alignItems: 'center' }}>
            • New issues will be automatically tracked and converted
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', display: 'flex', alignItems: 'center' }}>
            • Each issue will receive the specified default reward
          </Typography>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <form onSubmit={handleAddRepository}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Repository URL"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
                sx={{ height: '80px' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Default Reward"
                type="number"
                value={defaultReward}
                onChange={(e) => setDefaultReward(e.target.value)}
                inputProps={{ min: "0", step: "0.01" }}
                required
                variant="outlined"
                helperText="Default reward per issue"
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
                sx={{ height: '80px' }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Box sx={{ height: '80px', display: 'flex', alignItems: 'flex-start', pt: '3px' }}>
                <Button
                  fullWidth
                  variant="contained"
                  style={{
                    backgroundColor: '#4CAF50',
                    '&:hover': {
                      backgroundColor: '#45a049'
                    }
                  }}
                  type="submit"
                  startIcon={<AddIcon />}
                  disabled={!authToken}
                  sx={{ 
                    height: '56px',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    backgroundColor: '#4CAF50',
                    '&:hover': {
                      backgroundColor: '#45a049'
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {repositoryError && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff3f0', borderRadius: 2 }}>
          <Typography color="error" sx={{ display: 'flex', alignItems: 'center' }}>
            Error: {repositoryError}
          </Typography>
        </Paper>
      )}

      <List sx={{ 
        bgcolor: 'background.paper', 
        borderRadius: 2,
        border: '1px solid #e0e0e0'
      }}>
        {repositories.map((repo) => (
          <ListItem 
            key={repo.id} 
            divider 
            sx={{
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              py: 2
            }}
          >
            <ListItemText
              primary={repo.repo_url}
              secondary={`Default Reward: ${repo.default_reward} credits per issue`}
              primaryTypographyProps={{
                sx: { color: '#1976d2', fontWeight: 500, mb: 0.5 }
              }}
              secondaryTypographyProps={{
                sx: { color: '#666' }
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleRemoveRepository(repo.repo_url)}
                disabled={!authToken}
                sx={{
                  '&:hover': {
                    color: '#d32f2f',
                    backgroundColor: 'rgba(211, 47, 47, 0.04)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default GitHubIntegration; 