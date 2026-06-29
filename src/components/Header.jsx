import React, { useState, useEffect } from 'react';
import { Menu, X, Bell, LogIn, Search } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SideNav from './SideNav';
import { useAuth } from '../context/AuthContext';
import logo4 from '../assets/logo4.png';

export const Header = ({ userType = 'guest', isOpen: propIsOpen, setIsOpen: propSetIsOpen, onLogout = () => {} }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Error en logout:', e);
    }
    try { if (typeof onLogout === 'function') onLogout(); } catch (e) {}
    window.location.href = '/';
  };
  const [internalOpen, setInternalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(() => {
    try { return parseInt(localStorage.getItem('sportshausen_notifs_unread') || '0', 10); } catch { return 0; }
  });
  const location = useLocation();

  useEffect(() => {
    const sync = () => {
      try { setUnreadCount(parseInt(localStorage.getItem('sportshausen_notifs_unread') || '0', 10)); } catch {}
    };
    window.addEventListener('notifs-updated', sync);
    return () => window.removeEventListener('notifs-updated', sync);
  }, []);
  const authed = typeof window !== 'undefined' && !!sessionStorage.getItem('authToken');
  // Show left drawer for authenticated users on app pages, but hide on landing and login
  const showLeftDrawer = authed && !['/', '/login'].includes(location.pathname);
  const userId = typeof window !== 'undefined' ? (localStorage.getItem('userId') || '1') : '1';
  const userTypeStored = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
  const dashboardPath = userTypeStored === 'luchador' ? '/panel/luchador' : userTypeStored === 'agrupacion' ? '/dashboard/agrupacion' : '/dashboard/booker';
  const menuItems = [
    { label: 'Perfil', to: `/perfil/${userId}` },
    { label: 'Dashboard', to: dashboardPath },
    { label: 'Panel de Luchador', to: '/panel/luchador' },
    { label: 'Calendario', to: null },
    { label: 'Eventos', to: null },
    { label: 'Ofertas', to: null },
  ];

  useEffect(() => {
    try {
      if (leftMenuOpen) document.body.classList.add('left-drawer-open');
      else document.body.classList.remove('left-drawer-open');
    } catch (e) {}
    return () => { try { document.body.classList.remove('left-drawer-open'); } catch(e){} };
  }, [leftMenuOpen]);

  useEffect(() => {
    if (!showLeftDrawer) setLeftMenuOpen(false);
  }, [showLeftDrawer]);

  // Determine whether parent provided controlled props
  const isControlled = typeof propSetIsOpen === 'function';
  const isOpen = isControlled ? !!propIsOpen : internalOpen;
  const setIsOpen = isControlled ? propSetIsOpen : setInternalOpen;

  return (
    <>
    <header className="bg-sporthausen-primary border-b border-[#0d1a2b] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Menu button + logo */}
          <div className="flex items-center gap-3">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-white/10 transition-colors md:hidden text-white">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button onClick={() => {
              try {
                const authed = !!sessionStorage.getItem('authToken');
                if (authed) {
                  if (userTypeStored === 'luchador') navigate('/panel/luchador');
                  else if (userTypeStored === 'agrupacion') navigate('/dashboard/agrupacion');
                  else navigate('/dashboard');
                } else {
                  navigate('/');
                }
              } catch (e) { navigate('/'); }
            }} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-md bg-white">
                <img src={logo4} alt="SportsHausen" className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:block text-xl font-bold text-white font-display">
                SportsHausen
              </span>
            </button>
          </div>

          {/* Desktop Navigation - Centro: authenticated */}
          {userType !== 'guest' && (
            <div className="hidden md:flex items-center gap-4 flex-1 mx-8">
              <div className="flex-1"></div>
            </div>
          )}

          {/* Desktop Navigation - Guest */}
          {userType === 'guest' && (
            <nav className="hidden md:flex items-center gap-8">
              <a href="/" className="text-white/80 hover:text-sporthausen-secondary transition-colors font-medium">
                Inicio
              </a>
              <a href="#features" className="text-white/80 hover:text-sporthausen-secondary transition-colors font-medium">
                Características
              </a>
              <a href="#" className="text-white/80 hover:text-sporthausen-secondary transition-colors font-medium">
                Sobre Nosotros
              </a>
            </nav>
          )}

          {/* Right side icons/buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            {userType === 'guest' && (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2 btn-outline-light rounded-full font-semibold group text-sm"
                >
                  <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                  <span className="hidden sm:inline">Ingresar</span>
                </Link>
                <button
                  onClick={() => navigate('/signup')}
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 btn-primary rounded-full font-semibold text-sm"
                >
                  Registrarse
                </button>
              </>
            )}

            {userType !== 'guest' && (
              <>
                <div className="hidden md:flex items-center relative">
                  {searchOpen ? (
                    <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 border border-white/20">
                      <Search size={16} className="text-white/60" />
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && searchQuery.trim()) {
                            const dest = userTypeStored === 'luchador' ? '/panel/luchador'
                              : userTypeStored === 'agrupacion' ? '/dashboard/agrupacion'
                              : '/dashboard/booker';
                            navigate(dest);
                            setSearchOpen(false);
                            setSearchQuery('');
                          }
                          if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
                        }}
                        placeholder="Buscar luchadores..."
                        className="bg-transparent outline-none text-sm w-48 text-white placeholder-white/50"
                      />
                      <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-white/60 hover:text-white">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 px-4 py-2 text-white/70 hover:bg-white/10 rounded-full transition-colors">
                      <Search size={18} />
                    </button>
                  )}
                </div>
                <button onClick={() => navigate('/notificaciones')} className="hidden md:flex items-center gap-2 px-4 py-2 text-white/70 hover:bg-white/10 rounded-full transition-colors relative">
                  <Bell size={18} />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-sporthausen-accent rounded-full"></span>}
                </button>
                <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/20 relative">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="w-9 h-9 bg-gradient-to-br from-sporthausen-secondary to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:ring-2 ring-sporthausen-accent transition-all">
                    U
                  </button>
                  {/* Dropdown menu */}
                  {menuOpen && (
                    <div className="absolute right-0 mt-12 w-56 bg-white rounded-md shadow-lg border border-gray-100 z-50">
                      <button onClick={() => { setMenuOpen(false); navigate(`/perfil/${userId}`); }} className="w-full text-left px-4 py-2 text-sporthausen-neutral-dark hover:bg-sporthausen-neutral-light">Mi Perfil</button>
                      <button onClick={() => { setMenuOpen(false); navigate(dashboardPath); }} className="w-full text-left px-4 py-2 text-sporthausen-neutral-dark hover:bg-sporthausen-neutral-light">Mi Dashboard</button>
                      <div className="border-t border-gray-100" />
                      <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2 text-sporthausen-accent hover:bg-sporthausen-neutral-light font-semibold">Cerrar sesión</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation for guest only */}
        {userType === 'guest' && isOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-sporthausen-primary border-t border-white/10">
            <a href="/" className="block px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition-colors">
              Inicio
            </a>
            <a href="#features" className="block px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition-colors">
              Características
            </a>
            <div className="pt-4 space-y-2 border-t border-white/10 mx-4">
              <Link to="/login" className="block px-4 py-2.5 text-white font-semibold text-center border border-white/30 rounded-lg hover:bg-white/10 transition-colors">
                Ingresar
              </Link>
              <Link to="/signup" className="block px-4 py-2.5 btn-primary text-white font-semibold text-center rounded-lg">
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
    {/* Render mobile drawer only when Header manages its own state (avoid duplicates) */}
    {!isControlled && <SideNav isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  );
};

export default Header;