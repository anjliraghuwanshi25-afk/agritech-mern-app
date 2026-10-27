import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 my-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading authentication state...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 shadow-sm border-danger">
          <h3 className="text-danger">Access Restricted</h3>
          <p className="text-muted">You need Administrator privileges to access this control center.</p>
          <div>
            <a href="/dashboard" className="btn btn-agri">Return to Farmer Dashboard</a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
