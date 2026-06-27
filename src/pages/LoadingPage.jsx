import React from 'react';

export const LoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sporthausen-neutral-light">
      <div className="text-center">
        <div className="mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-sportshausen-red mx-auto"></div>
        </div>
        <h2 className="text-2xl font-bold text-sportshausen-dark mb-2">Cargando...</h2>
        <p className="text-gray-600">Por favor espera mientras verificamos tu sesión</p>
      </div>
    </div>
  );
};

export default LoadingPage;
