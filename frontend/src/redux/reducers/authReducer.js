import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR
} from '../actions/actionTypes';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      };
    
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
      };
    
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    default:
      return state;
  }
};

export default authReducer;