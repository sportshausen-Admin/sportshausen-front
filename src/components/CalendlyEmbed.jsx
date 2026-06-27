import React, { useEffect } from 'react';
import './CalendlyEmbed.css';

const CalendlyEmbed = ({ calendlyUrl = 'https://calendly.com/' }) => {
  useEffect(() => {
    // Cargar el script de Calendly
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpiar el script cuando el componente se desmonte
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="calendly-embed-container">
      <div 
        className="calendly-inline-widget"
        data-url={calendlyUrl}
        style={{ minWidth: '100%', height: '900px' }}
      ></div>
    </div>
  );
};

export default CalendlyEmbed;
