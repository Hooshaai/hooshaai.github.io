import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative z-10">
        <div className="text-white font-mono text-sm tracking-widest uppercase animate-pulse">
          Authenticating Session...
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to a unified login page or Admin login if they try to access protected areas
    // Here we can just redirect to /admin since it has the login form, or a dedicated /login
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user.is_staff) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative z-10 px-4">
        <div className="border border-red-500/50 bg-red-500/10 text-red-500 p-8 rounded-xl font-mono text-center max-w-md">
          <div className="text-2xl mb-4 font-bold">ACCESS DENIED</div>
          <div className="text-sm">Root privileges are required for this sector.</div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
