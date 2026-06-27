import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Esperar a que se cargue la autenticación desde localStorage
    if (!loading) {
      setIsReady(true);
    }
  }, [loading]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sportshausen-red mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y no lo tiene, redirigir a su dashboard
  if (requiredRole && user?.role !== requiredRole) {
    const userRole = user?.role || 'luchador';
    const redirectTo = userRole === 'luchador' ? '/panel/luchador' : `/dashboard/${userRole}`;
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
