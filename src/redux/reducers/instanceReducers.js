import {
  FETCH_INSTANCES_REQUEST,
  FETCH_INSTANCES_SUCCESS,
  FETCH_INSTANCES_FAILURE,
  CREATE_INSTANCE_REQUEST,
  CREATE_INSTANCE_SUCCESS,
  CREATE_INSTANCE_FAILURE,
  ADD_REPOSITORY_REQUEST,
  ADD_REPOSITORY_SUCCESS,
  ADD_REPOSITORY_FAILURE,
  FETCH_REPOSITORIES_REQUEST,
  FETCH_REPOSITORIES_SUCCESS,
  FETCH_REPOSITORIES_FAILURE,
  REMOVE_REPOSITORY_REQUEST,
  REMOVE_REPOSITORY_SUCCESS,
  REMOVE_REPOSITORY_FAILURE,
  FETCH_REPOSITORY_ISSUES_REQUEST,
  FETCH_REPOSITORY_ISSUES_SUCCESS,
  FETCH_REPOSITORY_ISSUES_FAILURE
} from '../actions/instanceActions';

const initialState = {
  instances: [],
  repositories: [],
  repositoryIssues: {},
  loading: false,
  error: null,
  creatingInstance: false,
  repositoryLoading: false,
  repositoryError: null
};

const instanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INSTANCES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_INSTANCES_SUCCESS:
      return { ...state, loading: false, instances: action.payload };
    case FETCH_INSTANCES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case CREATE_INSTANCE_REQUEST:
      return { ...state, creatingInstance: true, error: null };
    case CREATE_INSTANCE_SUCCESS:
      return { ...state, creatingInstance: false, instances: [...state.instances, action.payload] };
    case CREATE_INSTANCE_FAILURE:
      return { ...state, creatingInstance: false, error: action.payload };
    case ADD_REPOSITORY_REQUEST:
      return { ...state, repositoryLoading: true, repositoryError: null };
    case ADD_REPOSITORY_SUCCESS:
      return { 
        ...state, 
        repositoryLoading: false, 
        repositories: [...state.repositories, action.payload]
      };
    case ADD_REPOSITORY_FAILURE:
      return { ...state, repositoryLoading: false, repositoryError: action.payload };
    case FETCH_REPOSITORIES_REQUEST:
      return { ...state, repositoryLoading: true, repositoryError: null };
    case FETCH_REPOSITORIES_SUCCESS:
      return { ...state, repositoryLoading: false, repositories: action.payload };
    case FETCH_REPOSITORIES_FAILURE:
      return { ...state, repositoryLoading: false, repositoryError: action.payload };
    case REMOVE_REPOSITORY_REQUEST:
      return { ...state, repositoryLoading: true, repositoryError: null };
    case REMOVE_REPOSITORY_SUCCESS:
      const { [action.payload]: removedIssues, ...remainingIssues } = state.repositoryIssues;
      return {
        ...state,
        repositoryLoading: false,
        repositories: state.repositories.filter(repo => repo.repo_url !== action.payload),
        repositoryIssues: remainingIssues
      };
    case REMOVE_REPOSITORY_FAILURE:
      return { ...state, repositoryLoading: false, repositoryError: action.payload };
    case FETCH_REPOSITORY_ISSUES_REQUEST:
      return { ...state, repositoryLoading: true };
    case FETCH_REPOSITORY_ISSUES_SUCCESS:
      return {
        ...state,
        repositoryLoading: false,
        repositoryIssues: {
          ...state.repositoryIssues,
          [action.payload.repoUrl]: action.payload.issues
        }
      };
    case FETCH_REPOSITORY_ISSUES_FAILURE:
      return {
        ...state,
        repositoryLoading: false,
        repositoryError: action.payload
      };
    default:
      return state;
  }
};

export default instanceReducer;