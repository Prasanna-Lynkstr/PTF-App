import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { loggedIn, loading: isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return loggedIn ? children : <Navigate to="/hiring-org" />;
};

export default ProtectedRoute;