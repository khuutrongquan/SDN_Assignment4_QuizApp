import {
  FETCH_QUIZZES,
  FETCH_QUIZ_DETAIL,
  CREATE_QUIZ,
  UPDATE_QUIZ,
  DELETE_QUIZ,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR
} from '../actions/actionTypes';

const initialState = {
  quizzes: [],
  currentQuiz: null,
  loading: false,
  error: null
};

const quizReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_QUIZZES:
      return {
        ...state,
        quizzes: action.payload,
        loading: false
      };
    
    case FETCH_QUIZ_DETAIL:
      return {
        ...state,
        currentQuiz: action.payload,
        loading: false
      };
    
    case CREATE_QUIZ:
      return {
        ...state,
        quizzes: [...state.quizzes, action.payload],
        loading: false
      };
    
    case UPDATE_QUIZ:
      return {
        ...state,
        quizzes: state.quizzes.map(quiz =>
          quiz._id === action.payload._id ? action.payload : quiz
        ),
        currentQuiz: action.payload,
        loading: false
      };
    
    case DELETE_QUIZ:
      return {
        ...state,
        quizzes: state.quizzes.filter(quiz => quiz._id !== action.payload),
        loading: false
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

export default quizReducer;