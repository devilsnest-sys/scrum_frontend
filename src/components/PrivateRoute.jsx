// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ element }) => {
    const isAuthenticated = useAuth();
    const location = useLocation();
  
    if (isAuthenticated) {
      return element;
    } else {
      return <Navigate to="/dasboard" state={{ from: location }} replace />;
    }
  };
  
  

export default PrivateRoute;
