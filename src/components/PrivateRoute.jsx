// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('token'); // o 'client-token' según uses

  if (!token) {
    return <Navigate to="/" replace />; // redirige al login si no está autenticado
  }

  return children;
};

export default PrivateRoute;
