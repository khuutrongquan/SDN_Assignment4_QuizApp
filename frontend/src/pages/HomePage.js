import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchQuizzes } from '../redux/actions/quizActions';

function HomePage() {
  const dispatch = useDispatch();
  const { quizzes, loading, error } = useSelector(state => state.quiz);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">📚 Available Quizzes</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {!isAuthenticated && (
        <Alert variant="info">
          Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to take quizzes
        </Alert>
      )}

      {quizzes.length === 0 ? (
        <Alert variant="warning">No quizzes available</Alert>
      ) : (
        <Row>
          {quizzes.map(quiz => (
            <Col md={6} lg={4} key={quiz._id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{quiz.title}</Card.Title>
                  <Card.Text>{quiz.description}</Card.Text>
                  <p className="text-muted small">
                    Questions: {quiz.questions.length}
                  </p>
                  <p className="text-muted small">
                    By: {quiz.author?.username}
                  </p>
                </Card.Body>
                <Card.Footer className="bg-white">
                  {isAuthenticated ? (
                    <Link to={`/quiz/${quiz._id}`}>
                      <Button variant="primary" className="w-100">
                        Start Quiz
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <Button variant="primary" className="w-100" disabled>
                        Start Quiz (Login Required)
                      </Button>
                    </Link>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default HomePage;