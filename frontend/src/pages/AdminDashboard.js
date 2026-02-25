import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Tabs, Tab, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { createQuiz, fetchQuizzes, updateQuiz, deleteQuiz } from '../redux/actions/quizActions';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { quizzes, loading, error } = useSelector(state => state.quiz);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [activeTab, setActiveTab] = useState('create');

  // Load quizzes and available questions when admin dashboard mounts
  useEffect(() => {
    dispatch(fetchQuizzes());
    const loadQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/questions');
        setAllQuestions(res.data.data || []);
      } catch (err) {
        console.error('Error loading questions:', err);
      }
    };
    loadQuestions();
  }, [dispatch]);

  const toggleQuestionSelection = (questionId, isChecked) => {
    if (isChecked) {
      setSelectedQuestionIds(prev =>
        prev.includes(questionId) ? prev : [...prev, questionId]
      );
    } else {
      setSelectedQuestionIds(prev => prev.filter(id => id !== questionId));
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    if (title.trim() === '') {
      alert('Please enter quiz title');
      return;
    }

    if (selectedQuestionIds.length === 0) {
      alert('Please select at least one question');
      return;
    }

    try {
      if (editingQuizId) {
        await dispatch(updateQuiz(editingQuizId, title, description, selectedQuestionIds));
        alert('Quiz updated successfully!');
      } else {
        await dispatch(createQuiz(title, description, selectedQuestionIds));
        alert('Quiz created successfully!');
      }
      setTitle('');
      setDescription('');
      setSelectedQuestionIds([]);
      setEditingQuizId(null);
      dispatch(fetchQuizzes());
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleEditQuiz = (quiz) => {
    setTitle(quiz.title || '');
    setDescription(quiz.description || '');
    setEditingQuizId(quiz._id);
    const ids = Array.isArray(quiz.questions)
      ? quiz.questions.map(q => (q && q._id ? q._id : q))
      : [];
    setSelectedQuestionIds(ids);
    setActiveTab('create');
  };

  const handleDeleteQuiz = async (quizId) => {
    const confirm = window.confirm('Are you sure you want to delete this quiz?');
    if (!confirm) return;

    try {
      await dispatch(deleteQuiz(quizId));
      dispatch(fetchQuizzes());
    } catch (err) {
      console.error('Error deleting quiz:', err);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4">👨‍💼 Admin Dashboard</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'create')}
        className="mb-3"
      >
        <Tab eventKey="create" title="Create Quiz">
          <Card className="mt-3">
            <Card.Body>
              <Form onSubmit={handleCreateQuiz}>
                <Form.Group className="mb-3">
                  <Form.Label>Quiz Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter quiz title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter quiz description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Select Questions for this Quiz</Form.Label>
                  <div className="border p-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {allQuestions.length === 0 && (
                      <div className="text-muted small">No questions available.</div>
                    )}
                    {allQuestions.map(question => (
                      <Form.Check
                        key={question._id}
                        type="checkbox"
                        label={question.text}
                        checked={selectedQuestionIds.includes(question._id)}
                        onChange={(e) =>
                          toggleQuestionSelection(question._id, e.target.checked)
                        }
                        className="mb-1"
                      />
                    ))}
                  </div>
                </Form.Group>

                <Button 
                  variant="success" 
                  type="submit"
                  disabled={loading || selectedQuestionIds.length === 0}
                  className="w-100"
                >
                  {editingQuizId
                    ? loading ? 'Updating...' : 'Update Quiz'
                    : loading ? 'Creating...' : 'Create Quiz'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="manage" title="My Quizzes">
          <div className="mt-3">
            {quizzes.filter(q => q.author?._id === user?.userId).length === 0 ? (
              <Alert variant="info">No quizzes created yet</Alert>
            ) : (
              <ListGroup>
                {quizzes
                  .filter(q => q.author?._id === user?.userId)
                  .map(quiz => (
                    <ListGroup.Item key={quiz._id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{quiz.title}</h6>
                          <small>{quiz.questions?.length || 0} questions</small>
                        </div>
                        <div>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditQuiz(quiz)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteQuiz(quiz._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            )}
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default AdminDashboard;