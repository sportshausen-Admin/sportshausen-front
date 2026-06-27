import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      const role = user?.role || 'luchador';
      navigate(`/dashboard/${role}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-sporthausen-neutral-light flex flex-col">
      <Header userType={isAuthenticated ? user?.role : 'guest'} />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl font-display font-bold text-sportshausen-red mb-4">404</h1>
            <p className="text-2xl font-bold text-sportshausen-dark mb-2">¡Página no encontrada!</p>
            <p className="text-gray-600">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-sportshausen-red text-sportshausen-red font-semibold rounded-lg hover:bg-red-50 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver atrás
            </button>
            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sportshausen-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              <Home size={20} />
              {isAuthenticated ? 'Dashboard' : 'Inicio'}
            </button>
          </div>

          {/* Additional info */}
          <div className="bg-sporthausen-neutral-light rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-4">
              Si crees que esto es un error, intenta:
            </p>
            <ul className="text-left space-y-2 text-sm text-gray-600">
              <li>✓ Verificar que la URL sea correcta</li>
              <li>✓ Limpiar el caché del navegador</li>
              <li>✓ Contactar con el soporte si el problema persiste</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
