import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, Form, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import { fetchQuizById } from '../redux/actions/quizActions';

function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, loading, error } = useSelector(state => state.quiz);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    dispatch(fetchQuizById(quizId));
  }, [dispatch, quizId]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">No questions in this quiz</Alert>
      </Container>
    );
  }

  const questions = currentQuiz.questions;
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerChange = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswerIndex) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setQuizFinished(true);
  };

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Container className="mt-5">
        <Card className="text-center">
          <Card.Body>
            <h2 className="mb-4">Quiz Finished!</h2>
            <h4 className="mb-4">
              Your Score: {score}/{questions.length} ({percentage}%)
            </h4>
            <div className="mb-4">
              <ProgressBar 
                now={percentage} 
                label={`${percentage}%`}
                variant={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'danger'}
              />
            </div>
            <div className="mb-4">
              <h5>Result: {percentage >= 70 ? '✓ Passed' : '✗ Failed'}</h5>
            </div>
            <Button 
              variant="primary" 
              onClick={() => navigate('/')}
              className="me-2"
            >
              Back to Home
            </Button>
            {/* <Button 
              variant="secondary" 
              onClick={() => window.location.reload()}
            >
              Retake Quiz
            </Button> */}
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="mb-4">
        <h2>{currentQuiz.title}</h2>
        <ProgressBar now={progress} label={`Question ${currentQuestion + 1}/${questions.length}`} />
      </div>

      <Card>
        <Card.Body>
          <h5 className="mb-4">
            {currentQuestion + 1}. {question.text}
          </h5>

          <Form.Group className="mb-4">
            {question.options.map((option, index) => (
              <Form.Check
                key={index}
                type="radio"
                id={`option-${index}`}
                label={option}
                name="answer"
                value={index}
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswerChange(index)}
                className="mb-2"
              />
            ))}
          </Form.Group>

          <div className="d-flex gap-2">
            <Button 
              variant="secondary" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion < questions.length - 1 ? (
              <Button 
                variant="primary" 
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="success" 
                onClick={handleSubmit}
              >
                Finish Quiz
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default QuizPage;