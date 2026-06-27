import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicRoute = ({ children, redirectIfAuth = null }) => {
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

  // Si está autenticado y es una ruta de auth (login/signup), redirigir al dashboard
  if (isAuthenticated) {
    const userRole = user?.role || 'luchador';
    // Si se especifica dónde redirigir, usar eso; si no, usar el role del usuario
    return <Navigate to={redirectIfAuth || `/dashboard/${userRole}`} replace />;
  }

  return children;
};

export default PublicRoute;
