import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addRepository,
  fetchRepositories,
  removeRepository,
  fetchRepositoryIssues,
  blockIssue
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
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GitHubIcon from '@mui/icons-material/GitHub';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import TimerIcon from '@mui/icons-material/Timer';
import RefreshIcon from '@mui/icons-material/Refresh';

const GitHubIntegration = () => {
  const dispatch = useDispatch();
  const [repoUrl, setRepoUrl] = useState('');
  const [defaultReward, setDefaultReward] = useState('0.0');
  const [expandedRepos, setExpandedRepos] = useState({});
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [countdowns, setCountdowns] = useState({});
  
  const { repositories, repositoryIssues, repositoryLoading, repositoryError } = useSelector(state => state.instances);
  const { token: authToken } = useSelector(state => state.auth);

  const calculateTimeRemaining = (createdAt) => {
    const creationDate = new Date(createdAt);
    const blockDate = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000); // 1 day after creation
    const now = new Date();
    const timeRemaining = blockDate - now;

    if (timeRemaining <= 0) {
      return { expired: true, timeString: 'Block payment window has ended' };
    }

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return {
      expired: false,
      timeString: `${hours}h ${minutes}m`,
      hours,
      minutes,
      percentage: (timeRemaining / (24 * 60 * 60 * 1000)) * 100
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = {};
      repositories.forEach(repo => {
        if (repositoryIssues[repo.repo_url]) {
          repositoryIssues[repo.repo_url].forEach(issue => {
            if (issue.created_at) {
              newCountdowns[`${repo.repo_url}-${issue.issue_number}`] = calculateTimeRemaining(issue.created_at);
            }
          });
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [repositories, repositoryIssues]);

  useEffect(() => {
    if (authToken) {
      dispatch(fetchRepositories(authToken));
    }
  }, [dispatch, authToken]);

  useEffect(() => {
    if (authToken && repositories.length > 0) {
      repositories.forEach(repo => {
        dispatch(fetchRepositoryIssues(authToken, repo.repo_url));
      });
    }
  }, [dispatch, authToken, repositories]);

  useEffect(() => {
    if (repositoryError && repositoryError.includes('Insufficient balance')) {
      setToastMessage('Payment Required: Insufficient balance to add repository');
      setOpenToast(true);
    }
  }, [repositoryError]);

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

  const handleBlockIssue = (repoUrl, issueNumber) => {
    if (authToken) {
      dispatch(blockIssue(authToken, repoUrl, issueNumber))
        .catch(error => {
          console.error('Error blocking issue:', error);
        });
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
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
                placeholder="repository"
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
                borderBottom: '1px solid #d0d7de',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' }
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
                sx={{
                  flex: 1,
                  mr: { xs: 0, sm: 2 }
                }}
              />
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'flex-end', sm: 'flex-end' }
              }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    if (authToken) {
                      dispatch(fetchRepositoryIssues(authToken, repo.repo_url));
                    }
                  }}
                  size="small"
                  sx={{
                    color: '#57606a',
                    '&:hover': {
                      backgroundColor: '#f6f8fa',
                      color: '#24292f'
                    }
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRepoExpansion(repo.repo_url);
                  }}
                  size="small"
                  sx={{
                    color: '#57606a',
                    '&:hover': {
                      backgroundColor: '#f6f8fa',
                      color: '#24292f'
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
              </Box>
            </ListItem>
            
            {expandedRepos[repo.repo_url] && repositoryIssues[repo.repo_url] && (
              <List sx={{ pl: 4 }}>
                {repositoryIssues[repo.repo_url]
                  .filter(issue => {
                    const status = parseInt(issue.status);
                    return status === 0 || status === 8 || status === 9;
                  })
                  .map((issue) => (
                    <ListItem key={issue.issue_number} sx={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      py: 1,
                      borderBottom: '1px solid #eaecef',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 0 }
                    }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ 
                            color: '#24292f',
                            fontWeight: issue.payment_blocked ? 500 : 400,
                            textDecoration: issue.payment_blocked ? 'line-through' : 'none'
                          }}>
                            #{issue.issue_number} - {issue.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            mt: 0.5,
                            flexWrap: 'wrap'
                          }}>
                            <Typography variant="caption" sx={{ color: '#57606a' }}>
                              Issue Status: {parseInt(issue.status) === 8 ? 'Payment Required' : 
                                      parseInt(issue.status) === 9 ? 'Payment Blocked' :
                                      parseInt(issue.status) === 0 ? 'Open' : 
                                      issue.status || 'Open'} | 
                              Reward: {issue.default_reward ? `$${issue.default_reward}` : `$${repo.default_reward}`} |
                              {issue.instance_id ? ` Instance ID: ${issue.instance_id}` : ' No Instance'}
                            </Typography>
                          </Box>
                        }
                        sx={{
                          flex: 1,
                          mr: { xs: 0, sm: 2 }
                        }}
                      />
                      {parseInt(issue.status) !== 8 && parseInt(issue.status) !== 9 && !countdowns[`${repo.repo_url}-${issue.issue_number}`]?.expired && (
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            width: { xs: '100%', sm: 'auto' },
                            justifyContent: { xs: 'flex-end', sm: 'flex-end' },
                            mt: { xs: 1, sm: 0 },
                            position: { sm: 'absolute' },
                            right: { sm: 16 },
                            top: { sm: '50%' },
                            transform: { sm: 'translateY(-50%)' }
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2.5 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#57606a',
                                fontSize: '11px',
                                fontWeight: 500,
                                lineHeight: 1,
                                ml: '4px',
                                mb: '-15px'
                              }}
                            >
                              Time window to block
                            </Typography>
                            <Chip
                              label={countdowns[`${repo.repo_url}-${issue.issue_number}`]?.timeString}
                              size="small"
                              sx={{
                                backgroundColor: '#f6f8fa',
                                border: '1px solid #d0d7de',
                                color: '#24292f',
                                fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                                fontSize: '12px',
                                height: '24px',
                                mb: '18px',
                                ml: '17px',
                                '& .MuiChip-label': {
                                  px: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  lineHeight: 1,
                                }
                              }}
                              icon={<TimerIcon style={{ fontSize: 14, color: '#57606a' }} />}
                            />
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<MoneyOffIcon />}
                            onClick={() => handleBlockIssue(repo.repo_url, issue.issue_number)}
                            disabled={issue.payment_blocked}
                            sx={{
                              borderColor: '#d0d7de',
                              color: '#24292f',
                              textTransform: 'none',
                              fontSize: '12px',
                              fontWeight: 500,
                              fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                              minWidth: { xs: '120px', sm: 'auto' },
                              '&:hover': {
                                backgroundColor: '#f6f8fa',
                                borderColor: '#24292f'
                              },
                              '&:disabled': {
                                borderColor: '#d0d7de',
                                color: '#8c959f'
                              }
                            }}
                          >
                            Block Payment
                          </Button>
                        </Box>
                      )}
                    </ListItem>
                  ))}
              </List>
            )}
          </React.Fragment>
        ))}
      </List>
      <Snackbar 
        open={openToast} 
        autoHideDuration={6000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="error" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GitHubIntegration; 