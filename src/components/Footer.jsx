import React from 'react';
import { Mail, Phone, Share2 } from 'lucide-react';

export const Footer = ({ withSidebar }) => {
  const authed = typeof window !== 'undefined' && !!localStorage.getItem('authToken');
  const hasSidebar = withSidebar ?? authed;

  return (
    <footer className={`bg-sporthausen-primary text-white py-16 ${hasSidebar ? 'md:ml-64' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-sporthausen-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <h3 className="text-xl font-bold">SportsHausen</h3>
            </div>
            <p className="text-white/50 text-sm">Deporte y Comunidad</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Navegación</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><a href="/" className="hover:text-sporthausen-secondary transition-colors">Inicio</a></li>
              <li><a href="#" className="hover:text-sporthausen-secondary transition-colors">Luchadores</a></li>
              <li><a href="#" className="hover:text-sporthausen-secondary transition-colors">Bookers</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><a href="#" className="hover:text-sporthausen-secondary transition-colors">Términos</a></li>
              <li><a href="#" className="hover:text-sporthausen-secondary transition-colors">Privacidad</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contacto</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>hola@sportshausen.cl</li>
              <li>+56 9 XXXX XXXX</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/15 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/40 text-sm mb-4 md:mb-0">
              © 2026 SportsHausen. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/40 hover:text-sporthausen-secondary transition-colors">
                <Share2 size={20} />
              </a>
              <a href="#" className="text-white/40 hover:text-sporthausen-secondary transition-colors">
                <Mail size={20} />
              </a>
              <a href="#" className="text-white/40 hover:text-sporthausen-secondary transition-colors">
                <Phone size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
