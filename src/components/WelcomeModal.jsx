import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export const WelcomeModal = ({ userName, onClose, duration = 2500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed inset-0 bg-sporthausen-primary/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 md:p-12 max-w-md w-full text-center animate-fadeIn shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-sporthausen-secondary rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle size={48} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-sporthausen-primary mb-4">
          ¡Bienvenido!
        </h2>

        {/* Message */}
        <p className="text-lg md:text-xl text-slate-600 mb-2">
          <span className="font-semibold text-sporthausen-primary">{userName}</span>
        </p>
        <p className="text-slate-500 text-base">
          a <span className="font-semibold text-sporthausen-secondary">SportsHausen</span>
        </p>

        {/* Loading indicator */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-sporthausen-secondary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-sporthausen-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-sporthausen-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;
