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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GitHubIcon from '@mui/icons-material/GitHub';

const GitHubIntegration = () => {
  const dispatch = useDispatch();
  const [repoUrl, setRepoUrl] = useState('');
  const [defaultReward, setDefaultReward] = useState('0.0');
  const [expandedRepos, setExpandedRepos] = useState({});
  
  const { repositories, repositoryIssues, repositoryLoading, repositoryError } = useSelector(state => state.instances);
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

  const toggleRepoExpansion = (repoUrl) => {
    setExpandedRepos(prev => ({
      ...prev,
      [repoUrl]: !prev[repoUrl]
    }));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 3,
        borderBottom: '1px solid #e1e4e8',
        pb: 2
      }}>
        <GitHubIcon sx={{ 
          fontSize: 40, 
          color: '#24292f'
        }} />
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#24292f',
            fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.5
          }}
        >
          GitHub Repository Integration
        </Typography>
      </Box>

      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: '#f6f8fa',
        border: '1px solid #d0d7de',
        borderRadius: '6px'
      }}>
        <Typography 
          variant="body1" 
          gutterBottom 
          sx={{ 
            mb: 2, 
            color: '#24292f',
            fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
            fontSize: '14px',
            lineHeight: 1.5
          }}
        >
          Add your GitHub repositories to have their issues automatically converted into instances. 
          For each repository you add:
        </Typography>
        <Box sx={{ pl: 2, mb: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 1.5, 
              color: '#57606a',
              fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
              fontSize: '14px',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'center',
              '&:before': {
                content: '"•"',
                marginRight: '8px',
                color: '#57606a'
              }
            }}
          >
            All open issues will be converted into instances
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 1.5, 
              color: '#57606a',
              fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
              fontSize: '14px',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'center',
              '&:before': {
                content: '"•"',
                marginRight: '8px',
                color: '#57606a'
              }
            }}
          >
            New issues will be automatically tracked and converted
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#57606a',
              fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
              fontSize: '14px',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'center',
              '&:before': {
                content: '"•"',
                marginRight: '8px',
                color: '#57606a'
              }
            }}
          >
            Each issue will receive the specified default reward
          </Typography>
        </Box>
      </Paper>
      
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: '#ffffff',
        border: '1px solid #d0d7de',
        borderRadius: '6px'
      }}>
        <form onSubmit={handleAddRepository}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Repository URL"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="owner/repository"
                required
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    height: '32px',
                    fontSize: '14px',
                    backgroundColor: '#f6f8fa',
                    borderRadius: '6px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d0d7de'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#a8b1ba'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0969da',
                      borderWidth: '1px'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: '14px',
                    color: '#57606a',
                    '&.Mui-focused': {
                      color: '#0969da'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Default Reward"
                type="number"
                value={defaultReward}
                onChange={(e) => setDefaultReward(e.target.value)}
                inputProps={{ 
                  min: "0", 
                  step: "0.01",
                  style: { fontSize: '14px' }
                }}
                required
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    height: '32px',
                    fontSize: '14px',
                    backgroundColor: '#f6f8fa',
                    borderRadius: '6px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d0d7de'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#a8b1ba'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0969da',
                      borderWidth: '1px'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: '14px',
                    color: '#57606a',
                    '&.Mui-focused': {
                      color: '#0969da'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={!authToken}
                sx={{ 
                  height: '32px',
                  minWidth: '70px',
                  padding: '0 16px',
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontSize: '14px',
                  backgroundColor: '#2da44e',
                  color: '#ffffff',
                  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                  fontWeight: 500,
                  boxShadow: 'none',
                  border: '1px solid rgba(27, 31, 36, 0.15)',
                  '&:hover': {
                    backgroundColor: '#2c974b',
                    borderColor: 'rgba(27, 31, 36, 0.15)',
                    boxShadow: 'none'
                  },
                  '&:active': {
                    backgroundColor: '#298e46',
                    boxShadow: 'inset 0 1px 0 rgba(20,70,32,0.2)'
                  },
                  '&:disabled': {
                    backgroundColor: '#94d3a2',
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(27, 31, 36, 0.15)'
                  }
                }}
              >
                Add repository
              </Button>
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
        borderRadius: '6px',
        border: '1px solid #d0d7de',
        overflow: 'hidden'
      }}>
        {repositories.map((repo) => (
          <React.Fragment key={repo.id}>
            <ListItem 
              divider 
              onClick={() => toggleRepoExpansion(repo.repo_url)}
              sx={{
                '&:hover': {
                  backgroundColor: '#f6f8fa',
                },
                py: 2,
                cursor: 'pointer',
                borderBottom: '1px solid #d0d7de'
              }}
            >
              <ListItemText
                primary={repo.repo_url}
                secondary={`Default Reward: ${repo.default_reward} credits per issue`}
                primaryTypographyProps={{
                  sx: { 
                    color: '#24292f',
                    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                    fontWeight: 600,
                    fontSize: '14px',
                    mb: 0.5
                  }
                }}
                secondaryTypographyProps={{
                  sx: { 
                    color: '#57606a',
                    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                    fontSize: '12px'
                  }
                }}
              />
              <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  sx={{
                    mr: 1,
                    color: '#57606a',
                    '&:hover': {
                      backgroundColor: '#f6f8fa'
                    }
                  }}
                >
                  {expandedRepos[repo.repo_url] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveRepository(repo.repo_url);
                  }}
                  disabled={!authToken}
                  sx={{
                    color: '#57606a',
                    '&:hover': {
                      color: '#cf222e',
                      backgroundColor: '#ffebe9'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            
            {expandedRepos[repo.repo_url] && repositoryIssues[repo.repo_url]?.map((issue) => (
              <ListItem
                key={issue.id}
                sx={{
                  pl: 6,
                  py: 1.5,
                  borderLeft: '1px solid #d0d7de',
                  borderBottom: '1px solid #d0d7de',
                  bgcolor: '#f6f8fa'
                }}
              >
                <ListItemText
                  primary={`#${issue.issue_number}: ${issue.title}`}
                  secondary={
                    <React.Fragment>
                      <Typography 
                        component="span" 
                        variant="body2" 
                        sx={{
                          color: '#57606a',
                          fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                          fontSize: '12px'
                        }}
                      >
                        Status: open
                      </Typography>
                      {issue.instance_id && (
                        <Typography 
                          component="span" 
                          variant="body2" 
                          sx={{
                            ml: 2,
                            color: '#57606a',
                            fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                            fontSize: '12px'
                          }}
                        >
                          Instance ID: {issue.instance_id}
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                  primaryTypographyProps={{
                    sx: { 
                      color: '#24292f',
                      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                      fontSize: '14px',
                      fontWeight: 500
                    }
                  }}
                />
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default GitHubIntegration; 