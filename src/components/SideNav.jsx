import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, Calendar, MapPin, Briefcase, ClipboardList, MessageSquare, Bell, Ticket, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SideNav = ({ active, onSelect, isOpen = false, setIsOpen }) => {
  const authed = typeof window !== 'undefined' && !!localStorage.getItem('authToken');
  if (!authed) return null;
  const navigate = useNavigate();
  const { logout } = useAuth();
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
  const allItems = [
    { id: 'home',                label: 'Inicio',             icon: Home,          roles: ['luchador', 'agrupacion', 'booker'] },
    { id: 'profile',             label: 'Mi perfil',          icon: User,          roles: ['luchador', 'agrupacion', 'booker'] },
    { id: 'calendar',            label: 'Calendario',         icon: Calendar,      roles: ['luchador', 'agrupacion'] },
    { id: 'events',              label: 'Eventos',            icon: MapPin,        roles: ['luchador', 'agrupacion'] },
    { id: 'offers',              label: 'Ofertas',            icon: Briefcase,     roles: ['luchador'] },
    { id: 'postulaciones',       label: 'Postulaciones',      icon: ClipboardList, roles: ['agrupacion'] },
    { id: 'messages',            label: 'Mensajes',           icon: MessageSquare, roles: ['luchador', 'agrupacion', 'booker'] },
    { id: 'notifications',       label: 'Notificaciones',     icon: Bell,          roles: ['luchador', 'agrupacion', 'booker'] },
    { id: 'tickets',             label: 'Mis Tickets',        icon: Ticket,        roles: ['luchador'] },
    { id: 'tickets-agrupacion',  label: 'Gestionar Tickets',  icon: Ticket,        roles: ['agrupacion'] },
  ];

  const items = allItems.filter(item => !userType || item.roles.includes(userType));

  const handleClick = (id) => {
    const routes = {
      home:                 userType === 'luchador' ? '/panel/luchador'
                          : userType === 'booker'   ? '/dashboard/booker'
                          : '/dashboard/agrupacion',
      profile:              `/perfil/${localStorage.getItem('userId') || '1'}`,
      calendar:             userType === 'agrupacion' ? '/agenda/agrupacion' : '/calendario-disponibilidad',
      events:               userType !== 'agrupacion' ? '/mis-eventos' : '/dashboard/agrupacion',
      offers:               '/ofertas',
      postulaciones:        userType === 'agrupacion' ? '/dashboard/agrupacion' : null,
      messages:             '/mensajeria',
      notifications:        '/notificaciones',
      tickets:              '/mis-tickets',
      'tickets-agrupacion': '/tickets/agrupacion',
    };
    const route = routes[id];
    if (route) {
      // Para agrupacion navegando al dashboard, pasar el tab como state
      // así AgrupacionDashboard puede abrir la sección correcta directamente
      const state = (userType === 'agrupacion' && route === '/dashboard/agrupacion') ? { tab: id } : undefined;
      navigate(route, state ? { state } : undefined);
    }
    if (onSelect) onSelect(id);
  };

  const handleLogout = async () => {
    try { await logout(); } catch (e) {}
    window.location.href = '/';
  };

  const NavItem = ({ item, onClick }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => onClick(item.id)}
        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-3 ${
          active === item.id
            ? 'bg-sporthausen-primary text-white shadow-sm'
            : 'text-sporthausen-neutral-dark hover:bg-sporthausen-neutral-light hover:text-sporthausen-primary'
        }`}
      >
        <Icon size={18} />
        {item.label}
      </button>
    );
  };

  return (
    <>
      {/* Desktop sidebar — fondo Neutral Light (60%) con borde sutil */}
      <nav className="fixed left-0 top-16 bottom-0 w-64 bg-sporthausen-neutral-light border-r border-slate-200 p-4 hidden md:block z-40 overflow-y-auto">
        <div className="space-y-1">
          {items.map(item => (
            <NavItem key={item.id} item={item} onClick={handleClick} />
          ))}
        </div>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-sporthausen-primary/60 backdrop-blur-sm"
            onClick={() => setIsOpen && setIsOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-sporthausen-neutral-light p-4 shadow-xl overflow-y-auto flex flex-col">
            <div className="pt-4 space-y-1 flex-1">
              {items.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleClick(item.id);
                      setIsOpen && setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-3 ${
                      active === item.id
                        ? 'bg-sporthausen-primary text-white shadow-sm'
                        : 'text-sporthausen-neutral-dark hover:bg-white hover:text-sporthausen-primary'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="border-t border-slate-200 pt-3 mt-3">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-3 text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideNav;
