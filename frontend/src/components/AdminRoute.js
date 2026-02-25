import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;