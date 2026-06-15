import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente que protege una vista o un layout.
 * Si el usuario no ha iniciado sesión, lo redirige automáticamente al login.
 */
const ProtectedRoute = ({ component: Component, ...args }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Component {...args} />;
};

export default ProtectedRoute;
