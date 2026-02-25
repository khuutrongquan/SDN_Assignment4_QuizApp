import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { logoutUser } from '../redux/actions/authActions';

function NavbarComponent() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Navbar bg="dark" expand="lg" sticky="top" className="navbar-dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          📚 Quiz App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>

            {user?.admin && (
              <Nav.Link as={Link} to="/admin">
                Admin Dashboard
              </Nav.Link>
            )}

            {isAuthenticated && (
              <div className="d-flex align-items-center ms-3">
                <span className="text-light me-3">
                  Welcome, {user?.username}!
                </span>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;