import axios from 'axios';
import {
  FETCH_QUIZZES,
  FETCH_QUIZ_DETAIL,
  CREATE_QUIZ,
  UPDATE_QUIZ,
  DELETE_QUIZ,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR
} from './actionTypes';

const API_URL = 'http://localhost:3000/api/quizzes';

export const fetchQuizzes = () => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const response = await axios.get(API_URL);
    dispatch({
      type: FETCH_QUIZZES,
      payload: response.data.data
    });
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: error.response?.data?.message || 'Error fetching quizzes'
    });
  }
};

export const fetchQuizById = (quizId) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const response = await axios.get(`${API_URL}/${quizId}`);
    dispatch({
      type: FETCH_QUIZ_DETAIL,
      payload: response.data.data
    });
    return response.data.data;
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: error.response?.data?.message || 'Error fetching quiz'
    });
    throw error;
  }
};

export const createQuiz = (title, description, questions) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, {
      title,
      description,
      questions
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    dispatch({
      type: CREATE_QUIZ,
      payload: response.data.data
    });
    
    dispatch({ type: CLEAR_ERROR });
    return response.data.data;
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: error.response?.data?.message || 'Error creating quiz'
    });
    throw error;
  }
};

export const updateQuiz = (quizId, title, description, questions) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${quizId}`, {
      title,
      description,
      questions
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    dispatch({
      type: UPDATE_QUIZ,
      payload: response.data.data
    });
    
    dispatch({ type: CLEAR_ERROR });
    return response.data.data;
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: error.response?.data?.message || 'Error updating quiz'
    });
    throw error;
  }
};

export const deleteQuiz = (quizId) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/${quizId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    dispatch({
      type: DELETE_QUIZ,
      payload: quizId
    });
    
    dispatch({ type: CLEAR_ERROR });
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: error.response?.data?.message || 'Error deleting quiz'
    });
    throw error;
  }
};