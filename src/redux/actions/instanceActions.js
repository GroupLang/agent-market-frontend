import { toast } from 'react-toastify';

export const FETCH_INSTANCES_REQUEST = 'FETCH_INSTANCES_REQUEST';
export const FETCH_INSTANCES_SUCCESS = 'FETCH_INSTANCES_SUCCESS';
export const FETCH_INSTANCES_FAILURE = 'FETCH_INSTANCES_FAILURE';
export const CREATE_INSTANCE_REQUEST = 'CREATE_INSTANCE_REQUEST';
export const CREATE_INSTANCE_SUCCESS = 'CREATE_INSTANCE_SUCCESS';
export const CREATE_INSTANCE_FAILURE = 'CREATE_INSTANCE_FAILURE';
export const FETCH_INVOLVED_PROVIDERS_REQUEST = 'FETCH_INVOLVED_PROVIDERS_REQUEST';
export const FETCH_INVOLVED_PROVIDERS_SUCCESS = 'FETCH_INVOLVED_PROVIDERS_SUCCESS';
export const FETCH_INVOLVED_PROVIDERS_FAILURE = 'FETCH_INVOLVED_PROVIDERS_FAILURE';
export const ADD_REPOSITORY_REQUEST = 'ADD_REPOSITORY_REQUEST';
export const ADD_REPOSITORY_SUCCESS = 'ADD_REPOSITORY_SUCCESS';
export const ADD_REPOSITORY_FAILURE = 'ADD_REPOSITORY_FAILURE';
export const FETCH_REPOSITORIES_REQUEST = 'FETCH_REPOSITORIES_REQUEST';
export const FETCH_REPOSITORIES_SUCCESS = 'FETCH_REPOSITORIES_SUCCESS';
export const FETCH_REPOSITORIES_FAILURE = 'FETCH_REPOSITORIES_FAILURE';
export const REMOVE_REPOSITORY_REQUEST = 'REMOVE_REPOSITORY_REQUEST';
export const REMOVE_REPOSITORY_SUCCESS = 'REMOVE_REPOSITORY_SUCCESS';
export const REMOVE_REPOSITORY_FAILURE = 'REMOVE_REPOSITORY_FAILURE';
export const FETCH_REPOSITORY_ISSUES_REQUEST = 'FETCH_REPOSITORY_ISSUES_REQUEST';
export const FETCH_REPOSITORY_ISSUES_SUCCESS = 'FETCH_REPOSITORY_ISSUES_SUCCESS';
export const FETCH_REPOSITORY_ISSUES_FAILURE = 'FETCH_REPOSITORY_ISSUES_FAILURE';
export const BLOCK_ISSUE_REQUEST = 'BLOCK_ISSUE_REQUEST';
export const BLOCK_ISSUE_SUCCESS = 'BLOCK_ISSUE_SUCCESS';
export const BLOCK_ISSUE_FAILURE = 'BLOCK_ISSUE_FAILURE';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchInstances = (authToken, status = 0) => async (dispatch) => {
  dispatch({ type: FETCH_INSTANCES_REQUEST });
  let retries = 0;
  const maxRetries = 2;

  const attemptFetch = async () => {
    try {
      const response = await fetch(`https://api.agent.market/v1/instances/for-current-user?instance_status=${status}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.status === 401 && retries < maxRetries) {
        retries++;
        const backoffDelay = Math.min(1000 * Math.pow(2, retries), 10000); // exponential backoff with max 10s
        console.log(`Attempt ${retries} failed with 401, retrying in ${backoffDelay}ms...`);
        await delay(backoffDelay);
        return attemptFetch();
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch({ type: FETCH_INSTANCES_SUCCESS, payload: data.results || data });
    } catch (error) {
      console.error('Error fetching instances:', error);
      if (retries < maxRetries) {
        retries++;
        const backoffDelay = Math.min(1000 * Math.pow(2, retries), 10000);
        console.log(`Retrying fetchInstances in ${backoffDelay}ms...`);
        await delay(backoffDelay);
        return attemptFetch();
      }
      if (error.message.includes('401') && retries === maxRetries) {
        toast.error('Authentication failed. Please try logging in again.');
      }
      dispatch({ type: FETCH_INSTANCES_FAILURE, payload: error.message });
    }
  };

  return attemptFetch();
};

export const createInstance = (authToken, instanceParams) => async (dispatch) => {
  dispatch({ type: CREATE_INSTANCE_REQUEST });
  try {
    const response = await fetch('https://api.agent.market/v1/instances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        ...instanceParams,
        max_credit_per_instance: parseFloat(instanceParams.max_credit_per_instance.toFixed(2))
      })
    });
    if (!response.ok) throw new Error('Failed to create instance');
    const data = await response.json();
    dispatch({ type: CREATE_INSTANCE_SUCCESS, payload: data });
    toast.success('Instance created successfully!');
  } catch (error) {
    dispatch({ type: CREATE_INSTANCE_FAILURE, payload: error.message });
    toast.error('Failed to create instance');
  }
};

export const fetchInvolvedProviders = (authToken, instance_id) => async (dispatch) => {
  dispatch({ type: FETCH_INVOLVED_PROVIDERS_REQUEST });
  try {
    const response = await fetch(`https://api.agent.market/v1/instances/involved-providers?instance_id=${instance_id}`, {
    
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    dispatch({ type: FETCH_INVOLVED_PROVIDERS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: FETCH_INVOLVED_PROVIDERS_FAILURE, payload: error.message });
  }
};

export const fetchRepositoryIssues = (authToken, repoUrl) => async (dispatch) => {
  dispatch({ type: FETCH_REPOSITORY_ISSUES_REQUEST });
  let retries = 0;
  const maxRetries = 2;

  const attemptFetch = async () => {
    try {
      const url = new URL('https://api.agent.market/v1/github/repositories/issues');
      url.searchParams.append('repo_url', repoUrl);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch repository issues: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched issues:', data);
      dispatch({ type: FETCH_REPOSITORY_ISSUES_SUCCESS, payload: { repoUrl, issues: data } });
      return data;
    } catch (error) {
      console.log('Error fetching repository issues:', error);
      if (retries < maxRetries) {
        retries++;
        const backoffDelay = Math.min(1000 * Math.pow(2, retries), 10000);
        console.log(`Retrying fetchRepositoryIssues in ${backoffDelay}ms...`);
        await delay(backoffDelay);
        return attemptFetch();
      }
      dispatch({ type: FETCH_REPOSITORY_ISSUES_FAILURE, payload: error.message });
      throw error;
    }
  };

  return attemptFetch();
};

export const addRepository = (authToken, repoUrl, defaultReward, representativeAgent = false, maxRewardForEstimation = undefined) => async (dispatch) => {
  dispatch({ type: ADD_REPOSITORY_REQUEST });
  try {
    const url = new URL('https://api.agent.market/v1/github/repositories');
    
    // Properly encode query parameters
    const params = new URLSearchParams({
      repo_url: repoUrl,
      default_reward: defaultReward.toString(),
      representative_agent: representativeAgent.toString()
    });

    if (maxRewardForEstimation !== undefined) {
      params.append('max_reward_for_estimation', maxRewardForEstimation.toString());
    }

    // Append the query string to the URL
    url.search = params.toString();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add repository: ${errorText}`);
    }
    
    const data = await response.json();
    dispatch({ type: ADD_REPOSITORY_SUCCESS, payload: data });
    
    try {
      await dispatch(fetchRepositoryIssues(authToken, repoUrl));
    } catch (error) {
      console.error('Error fetching repository issues:', error);
    }
    
    toast.success('Repository added successfully! From now on, all open issues in this repository will be solved.');
  } catch (error) {
    dispatch({ type: ADD_REPOSITORY_FAILURE, payload: error.message });
    toast.error('Failed to add repository');
  }
};

export const fetchRepositories = (authToken) => async (dispatch) => {
  console.log('Fetching repositories');
  console.log('Auth token:', authToken ? 'Present' : 'Missing');
  
  dispatch({ type: FETCH_REPOSITORIES_REQUEST });
  try {
    console.log('Making GET request to /github/repositories');
    const response = await fetch('https://api.agent.market/v1/github/repositories', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch repositories: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Fetched repositories:', data);
    dispatch({ type: FETCH_REPOSITORIES_SUCCESS, payload: data });
  } catch (error) {
    console.error('Error in fetchRepositories:', error);
    dispatch({ type: FETCH_REPOSITORIES_FAILURE, payload: error.message });
    toast.error('Failed to fetch repositories');
  }
};

export const removeRepository = (authToken, repoUrl) => async (dispatch) => {
  console.log('Removing repository:', repoUrl);
  console.log('Auth token:', authToken ? 'Present' : 'Missing');

  dispatch({ type: REMOVE_REPOSITORY_REQUEST });
  try {
    console.log(`Making DELETE request to /github/repositories`);
    const url = new URL('https://api.agent.market/v1/github/repositories');
    url.searchParams.append('repo_url', repoUrl);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to remove repository: ${errorText}`);
    }
    
    dispatch({ type: REMOVE_REPOSITORY_SUCCESS, payload: repoUrl });
    console.log('Repository removed successfully');
    toast.success('Repository removed successfully!');
  } catch (error) {
    console.error('Error in removeRepository:', error);
    dispatch({ type: REMOVE_REPOSITORY_FAILURE, payload: error.message });
    toast.error('Failed to remove repository');
  }
};

export const blockIssue = (authToken, repoUrl, issueNumber) => async (dispatch) => {
  dispatch({ type: BLOCK_ISSUE_REQUEST });
  try {
    const url = new URL('https://api.agent.market/v1/github/repositories/issues/block');
    url.searchParams.append('repo_url', repoUrl);
    url.searchParams.append('issue_number', issueNumber.toString());

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Block issue error:', errorText);
      throw new Error('Failed to block issue');
    }

    const data = await response.json();
    dispatch({ type: BLOCK_ISSUE_SUCCESS, payload: { repoUrl, issueNumber } });
    toast.success('Issue payment blocked successfully!');
    return data;
  } catch (error) {
    console.error('Error blocking issue:', error);
    dispatch({ type: BLOCK_ISSUE_FAILURE, payload: error.message });
    toast.error('Failed to block issue payment');
    throw error;
  }
};
