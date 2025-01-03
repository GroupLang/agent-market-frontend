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
  Chip,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GitHubIcon from '@mui/icons-material/GitHub';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import TimerIcon from '@mui/icons-material/Timer';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import ListIcon from '@mui/icons-material/List';
import BugReportIcon from '@mui/icons-material/BugReport';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const GitHubIntegration = () => {
  const dispatch = useDispatch();
  const [repoUrl, setRepoUrl] = useState('');
  const [defaultReward, setDefaultReward] = useState('0.0');
  const [representativeAgent, setRepresentativeAgent] = useState(false);
  const [expandedRepos, setExpandedRepos] = useState({});
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [countdowns, setCountdowns] = useState({});
  const [blockingIssues, setBlockingIssues] = useState({});
  const [instanceStatuses, setInstanceStatuses] = useState({});
  
  const { repositories, repositoryIssues, repositoryLoading, repositoryError } = useSelector(state => state.instances);
  const { token: authToken } = useSelector(state => state.auth);

  const fetchInstanceStatus = async (instanceId) => {
    try {
      const response = await fetch(`https://api.agent.market/v1/instances/${instanceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch instance status');
      }
      const data = await response.json();
      setInstanceStatuses(prev => ({
        ...prev,
        [instanceId]: data.status
      }));
    } catch (error) {
      console.error('Error fetching instance status:', error);
    }
  };

  useEffect(() => {
    // Fetch instance statuses for issues that have instance_id
    repositories.forEach(repo => {
      if (repositoryIssues[repo.repo_url]) {
        repositoryIssues[repo.repo_url].forEach(issue => {
          if (issue.instance_id && !instanceStatuses[issue.instance_id]) {
            fetchInstanceStatus(issue.instance_id);
          }
        });
      }
    });
  }, [repositories, repositoryIssues, authToken]);

  const calculateTimeRemaining = (createdAt, prCreatedAt, status, updatedAt) => {
    const now = new Date();
    const creationDate = new Date(createdAt + 'Z'); // Ensure UTC

    // If issue is closed, start 7-day review period from updated_at
    if (parseInt(status) === 6 && updatedAt) {
      const updateDate = new Date(updatedAt + 'Z'); // Ensure UTC
      const reviewEndDate = new Date(updateDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      const timeRemaining = reviewEndDate.getTime() - now.getTime();

      if (timeRemaining <= 0) {
        return { expired: true, timeString: 'Review period ended', type: 'review' };
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      return {
        expired: false,
        timeString: `${days}d ${hours}h`,
        days,
        hours,
        percentage: (timeRemaining / (7 * 24 * 60 * 60 * 1000)) * 100,
        type: 'review'
      };
    }

    // If PR hasn't been created yet, check order expiration (2 days)
    if (!prCreatedAt) {
      const expirationDate = new Date(creationDate.getTime() + (2 * 24 * 60 * 60 * 1000));
      const timeRemaining = expirationDate.getTime() - now.getTime();

      if (timeRemaining <= 0) {
        return { expired: true, timeString: 'Order expired', type: 'expiration' };
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      return {
        expired: false,
        timeString: `${days}d ${hours}h`,
        days,
        hours,
        percentage: (timeRemaining / (2 * 24 * 60 * 60 * 1000)) * 100,
        type: 'expiration'
      };
    }

    // If PR has been created but issue not closed yet
    return { expired: false, timeString: 'PR opened', type: 'pr_opened' };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = {};
      repositories.forEach(repo => {
        if (repositoryIssues[repo.repo_url]) {
          repositoryIssues[repo.repo_url].forEach(issue => {
            if (issue.created_at) {
              newCountdowns[`${repo.repo_url}-${issue.issue_number}`] = calculateTimeRemaining(
                issue.created_at, 
                issue.pr_created_at,
                issue.status,
                issue.updated_at
              );
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
      dispatch(addRepository(authToken, repoUrl, parseFloat(defaultReward), representativeAgent));
      setRepoUrl('');
      setDefaultReward('0.0');
      setRepresentativeAgent(false);
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
      setBlockingIssues(prev => ({
        ...prev,
        [`${repoUrl}-${issueNumber}`]: true
      }));

      dispatch(blockIssue(authToken, repoUrl, issueNumber))
        .finally(() => {
          setBlockingIssues(prev => ({
            ...prev,
            [`${repoUrl}-${issueNumber}`]: false
          }));
        })
        .catch(error => {
          console.error('Error blocking issue:', error);
          if (error.response && error.response.status === 400) {
            setToastMessage('Cannot block payment: Bidding process has not finished');
            setOpenToast(true);
          }
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
                placeholder="Enter repository URL"
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
                Add Repository
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                mt: 1.5,
                backgroundColor: '#f6f8fa',
                border: '1px solid #d0d7de',
                borderRadius: '6px',
                padding: '8px 12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#57606a',
                  backgroundColor: '#f3f4f6',
                  boxShadow: '0 1px 3px rgba(27, 31, 36, 0.04)'
                }
              }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={representativeAgent}
                      onChange={(e) => setRepresentativeAgent(e.target.checked)}
                      sx={{
                        padding: '2px',
                        marginRight: '12px',
                        color: '#57606a',
                        '&.Mui-checked': {
                          color: '#2da44e',
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: 16,
                          transition: 'transform 0.2s ease',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(45, 164, 78, 0.08)',
                          '& .MuiSvgIcon-root': {
                            transform: 'scale(1.1)'
                          }
                        },
                        '&.Mui-checked:hover': {
                          backgroundColor: 'rgba(45, 164, 78, 0.12)'
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.75,
                      ml: 0.5
                    }}>
                      <Typography sx={{ 
                        fontSize: '13px',
                        color: '#24292f',
                        fontWeight: 500,
                        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                        letterSpacing: '-0.1px'
                      }}>
                        Add representative agent
                      </Typography>
                      <Tooltip 
                        title={
                          <Box sx={{ p: 0.75 }}>
                            <Typography sx={{ 
                              fontSize: '12px',
                              color: '#ffffff',
                              lineHeight: 1.4,
                              fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                              letterSpacing: '0.1px'
                            }}>
                              An AI agent will handle chat interactions. The reward will be shared between this agent and the issue-solving agent.
                            </Typography>
                          </Box>
                        }
                        placement="right"
                        arrow
                        enterDelay={200}
                        leaveDelay={150}
                        sx={{
                          '& .MuiTooltip-arrow': {
                            color: 'rgba(0, 0, 0, 0.9)'
                          },
                          '& .MuiTooltip-tooltip': {
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            borderRadius: '6px',
                            maxWidth: '300px'
                          }
                        }}
                      >
                        <HelpOutlineIcon sx={{ 
                          fontSize: 13, 
                          color: '#57606a',
                          cursor: 'help',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            color: '#24292f',
                            transform: 'scale(1.15)'
                          }
                        }} />
                      </Tooltip>
                    </Box>
                  }
                  sx={{
                    margin: 0,
                    userSelect: 'none',
                    width: '100%',
                    '& .MuiTypography-root': {
                      fontSize: '13px',
                      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                    },
                    '&:hover .MuiTypography-root': {
                      color: '#000000'
                    }
                  }}
                />
              </Box>
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
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ 
                      color: '#24292f',
                      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                      fontWeight: 600,
                      fontSize: '14px',
                      mb: 0.5
                    }}>
                      {repo.repo_url}
                    </Typography>
                    {repo.issue_number && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={<BugReportIcon sx={{ fontSize: '16px !important' }} />}
                          label="Single Issue"
                          size="small"
                          sx={{
                            height: '20px',
                            backgroundColor: '#fff8c5',
                            color: '#9a6700',
                            border: '1px solid rgba(154, 103, 0, 0.1)',
                            '& .MuiChip-label': {
                              px: 1,
                              fontSize: '12px',
                              fontWeight: 500
                            },
                            '& .MuiChip-icon': {
                              color: '#9a6700',
                              ml: 0.5
                            }
                          }}
                        />
                        <Chip
                          label={`#${repo.issue_number}`}
                          size="small"
                          sx={{
                            height: '20px',
                            backgroundColor: '#ddf4ff',
                            color: '#0969da',
                            border: '1px solid rgba(9, 105, 218, 0.1)',
                            '& .MuiChip-label': {
                              px: 1,
                              fontSize: '12px',
                              fontWeight: 600
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                }
                secondary={
                  <Typography sx={{ 
                    color: '#57606a',
                    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                    fontSize: '12px'
                  }}>
                    {repo.issue_number ? 'Reward' : 'Default Reward'}: {repo.default_reward} credits {repo.issue_number ? 'for this issue' : 'per issue'}
                  </Typography>
                }
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
                    // For closed issues (status 6), only show if instance status is 3
                    if (status === 6) {
                      return issue.instance_id && instanceStatuses[issue.instance_id] === 3;
                    }
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
                                      parseInt(issue.status) === 6 ? 'Closed' :
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
                      {(parseInt(issue.status) !== 8 && parseInt(issue.status) !== 9) && 
                       (parseInt(issue.status) === 6 || !countdowns[`${repo.repo_url}-${issue.issue_number}`]?.expired) && (
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
                                mb: '-15px',
                                display: countdowns[`${repo.repo_url}-${issue.issue_number}`]?.type === 'pr_opened' ? 'none' : 'block'
                              }}
                            >
                              {countdowns[`${repo.repo_url}-${issue.issue_number}`]?.type === 'review' 
                                ? 'Review period remaining'
                                : 'Waiting for PR'}
                            </Typography>
                            <Chip
                              label={countdowns[`${repo.repo_url}-${issue.issue_number}`]?.timeString}
                              size="small"
                              icon={
                                countdowns[`${repo.repo_url}-${issue.issue_number}`]?.type === 'review' 
                                  ? <TimerIcon style={{ fontSize: 14, color: '#0969da' }} />
                                  : countdowns[`${repo.repo_url}-${issue.issue_number}`]?.type === 'pr_opened'
                                    ? <InfoIcon style={{ fontSize: 14, color: '#2da44e' }} />
                                    : <TimerIcon style={{ fontSize: 14, color: '#9a6700' }} />
                              }
                              sx={{
                                backgroundColor: countdowns[`${repo.repo_url}-${issue.issue_number}`]?.type === 'review'
                                  ? '#ddf4ff'  // Light blue for review period
                                  : countdowns[`${repo.repo_url}-${issue.issue_number}`]?.type === 'pr_opened'
                                    ? '#dafbe1'  // Light green for PR opened
                                    : '#fff8c5', // Light yellow for expiration
                                border: '1px solid',
                                borderColor: countdowns[`${repo.repo_url}-${issue.issue_number}`]?.type === 'review'
                                  ? '#0969da'  // Blue for review period
                                  : countdowns[`${repo.repo_url}-${issue.issue_number}`]?.type === 'pr_opened'
                                    ? '#2da44e'  // Green for PR opened
                                    : '#9a6700', // Yellow for expiration
                                color: countdowns[`${repo.repo_url}-${issue.issue_number}`]?.type === 'review'
                                  ? '#0969da'  // Blue for review period
                                  : countdowns[`${repo.repo_url}-${issue.issue_number}`]?.type === 'pr_opened'
                                    ? '#2da44e'  // Green for PR opened
                                    : '#9a6700', // Yellow for expiration
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
                            />
                          </Box>
                          {countdowns[`${repo.repo_url}-${issue.issue_number}`]?.type === 'review' && 
                           issue.instance_id && 
                           instanceStatuses[issue.instance_id] === 3 && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={blockingIssues[`${repo.repo_url}-${issue.issue_number}`] ? <CircularProgress size={16} /> : <MoneyOffIcon />}
                              onClick={() => handleBlockIssue(repo.repo_url, issue.issue_number)}
                              disabled={issue.payment_blocked || blockingIssues[`${repo.repo_url}-${issue.issue_number}`]}
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
                              {blockingIssues[`${repo.repo_url}-${issue.issue_number}`] ? 'Blocking...' : 'Block Payment'}
                            </Button>
                          )}
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