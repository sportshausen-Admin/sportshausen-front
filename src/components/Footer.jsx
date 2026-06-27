import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = ({ withSidebar }) => {
  const authed = typeof window !== 'undefined' && !!localStorage.getItem('authToken');
  const hasSidebar = withSidebar ?? authed;
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;

  const navLinks = (() => {
    if (!authed) {
      return [
        { label: 'Inicio', to: '/' },
        { label: 'Luchadores', to: '/login' },
        { label: 'Agrupaciones', to: '/login' },
        { label: 'Bookers', to: '/login' },
      ];
    }
    if (userType === 'luchador') {
      return [
        { label: 'Inicio', to: '/' },
        { label: 'Mi Panel', to: '/panel/luchador' },
        { label: 'Mi Perfil', to: `/perfil/${localStorage.getItem('userId') || ''}` },
        { label: 'Calendario', to: '/calendario-disponibilidad' },
        { label: 'Mensajes', to: '/mensajeria' },
      ];
    }
    if (userType === 'agrupacion') {
      return [
        { label: 'Inicio', to: '/' },
        { label: 'Mi Dashboard', to: '/dashboard/agrupacion' },
        { label: 'Agenda', to: '/agenda/agrupacion' },
        { label: 'Mensajes', to: '/mensajeria' },
        { label: 'Tickets', to: '/tickets/agrupacion' },
      ];
    }
    if (userType === 'booker') {
      return [
        { label: 'Inicio', to: '/' },
        { label: 'Mi Dashboard', to: '/dashboard/booker' },
        { label: 'Mensajes', to: '/mensajeria' },
      ];
    }
    return [{ label: 'Inicio', to: '/' }];
  })();

  return (
    <footer className={`bg-sporthausen-primary text-white py-12 ${hasSidebar ? 'md:ml-64' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-sporthausen-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h3 className="text-xl font-bold">SportsHausen</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Plataforma de conexión entre luchadores profesionales, agrupaciones y bookers de lucha libre en Chile.
            </p>
          </div>

          {/* Navegación contextual */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Navegación</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {navLinks.map((link) => (
                <li key={link.to + link.label}>
                  <Link to={link.to} className="hover:text-sporthausen-secondary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contacto</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-sporthausen-secondary shrink-0" />
                <a href="mailto:administradorsportshausen@gmail.com" className="hover:text-sporthausen-secondary transition-colors break-all">
                  administradorsportshausen@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-sporthausen-secondary shrink-0" />
                <a href="tel:+56967022468" className="hover:text-sporthausen-secondary transition-colors">
                  +56 9 6702 2468
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-white/15 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2026 SportsHausen. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <a
                href="mailto:administradorsportshausen@gmail.com"
                className="text-white/40 hover:text-sporthausen-secondary transition-colors"
                title="Correo"
              >
                <Mail size={18} />
              </a>
              <a
                href="tel:+56967022468"
                className="text-white/40 hover:text-sporthausen-secondary transition-colors"
                title="Teléfono"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
