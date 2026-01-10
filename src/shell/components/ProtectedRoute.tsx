import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@shell/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isOwner } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-background-dark">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">You don't have permission to access this page.</p>
          <a href="/" className="text-primary hover:underline">Return to Home</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
