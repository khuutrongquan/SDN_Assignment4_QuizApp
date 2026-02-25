import axios from 'axios';
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, REGISTER_SUCCESS, REGISTER_FAILURE, SET_LOADING } from './actionTypes';

const API_URL = 'http://localhost:3000/api/users';

export const registerUser = (username, email, password) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password
    });
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: {
        user: response.data.data,
        token: response.data.token
      }
    });
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data));
    
    return response.data;
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.message || 'Registration failed'
    });
    throw error;
  }
};

export const loginUser = (username, password) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password
    });
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        user: response.data.data,
        token: response.data.token
      }
    });
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data));
    
    return response.data;
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.message || 'Login failed'
    });
    throw error;
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const checkAuth = () => (dispatch) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        user: JSON.parse(user),
        token
      }
    });
  }
};