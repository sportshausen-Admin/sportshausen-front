import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export const Toast = ({ type = 'success', message, onClose }) => {
  const bgColors = {
    success: 'bg-teal-50 border-sporthausen-secondary',
    error: 'bg-red-50 border-sporthausen-accent',
    warning: 'bg-amber-50 border-amber-400',
    info: 'bg-slate-50 border-slate-400',
  };

  const textColors = {
    success: 'text-sporthausen-neutral-dark',
    error: 'text-sporthausen-accent',
    warning: 'text-amber-800',
    info: 'text-sporthausen-neutral-dark',
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div className={`fixed bottom-4 right-4 ${bgColors[type]} border-l-4 rounded-lg p-4 flex items-center gap-3 shadow-lg max-w-md animate-slide-up`}>
      <span className={textColors[type]}>{icons[type]}</span>
      <span className={`${textColors[type]} flex-1`}>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={18} />
      </button>
    </div>
  );
};

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizes[size]} border-4 border-slate-200 border-t-sporthausen-secondary rounded-full animate-spin`}></div>
  );
};

export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-20 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );
};

export const EmptyState = ({ icon = '📭', title = 'Sin datos', description = 'No hay datos disponibles' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-sporthausen-neutral-dark mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default { Toast, LoadingSpinner, SkeletonLoader, EmptyState };

