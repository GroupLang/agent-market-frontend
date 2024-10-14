import {
  FETCH_INSTANCES_REQUEST,
  FETCH_INSTANCES_SUCCESS,
  FETCH_INSTANCES_FAILURE,
  CREATE_INSTANCE_REQUEST,
  CREATE_INSTANCE_SUCCESS,
  CREATE_INSTANCE_FAILURE
} from '../actions/instanceActions';

const initialState = {
  instances: [],
  loading: false,
  error: null,
  creatingInstance: false
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
    default:
      return state;
  }
};

export default instanceReducer;