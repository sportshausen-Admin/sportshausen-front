import React, { useState } from 'react';
import { Search, Home, Users, Calendar, MessageCircle, Bell, Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SideNav from '../components/SideNav';

export const FeedLuchador = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleLike = (postId) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const posts = [
    {
      id: 1,
      author: 'Carlos "El León" Rodríguez',
      role: 'Luchador Profesional',
      avatar: '🦁',
      time: 'Hace 2 horas',
      content: '¡Acabo de conseguir un evento en Santiago! Gracias a SportsHausen por conectarme con la mejor agrupación. ¡A prepararse! 💪',
      likes: 243,
      comments: 45,
      shares: 12
    },
    {
      id: 2,
      author: 'Agrupación Elite',
      role: 'Organizador de Eventos',
      avatar: '🎭',
      time: 'Hace 4 horas',
      content: 'Buscamos 3 luchadores talentosos para nuestro evento del 15 de Mayo. ¡Envíen sus propuestas! Disponible en SportsHausen. 📋',
      likes: 567,
      comments: 89,
      shares: 34
    },
    {
      id: 3,
      author: 'María González',
      role: 'Booker',
      avatar: '📋',
      time: 'Hace 6 horas',
      content: 'Lucha de campeonato del viernes a las 8pm en el Coliseo. ¡Los mejores talentos de Chile! ¿Ya confirmaste tu asistencia? 🔥',
      likes: 1203,
      comments: 234,
      shares: 567
    },
  ];

  const suggestedUsers = [
    { name: 'Phoenix', role: 'Luchador', avatar: '🔥', mutual: 45 },
    { name: 'Agrupación Premium', role: 'Organizador', avatar: '⭐', mutual: 89 },
    { name: 'Jorge "La Tormenta"', role: 'Luchador', avatar: '⛈️', mutual: 23 },
    { name: 'Events Pro', role: 'Booker', avatar: '🎪', mutual: 156 },
    { name: 'El Rey del Ring', role: 'Luchador', avatar: '👑', mutual: 67 },
  ];

  return (
    <div className="min-h-screen bg-sporthausen-neutral-light">
      <Header userType="luchador" isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <SideNav active={activeTab} onSelect={(id)=>setActiveTab(id)} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24 p-6">
              <h3 className="font-bold text-sportshausen-dark mb-4">Panel</h3>
              {[
                { id: 'profile', label: 'Mi perfil' },
                { id: 'calendar', label: 'Calendario' },
                { id: 'events', label: 'Eventos' },
                { id: 'offers', label: 'Ofertas' },
                { id: 'notifications', label: 'Notificaciones' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold mb-2 ${activeTab === item.id ? 'bg-sportshausen-red text-white' : 'hover:bg-sporthausen-neutral-light text-gray-700'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-2">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>
                <p className="text-gray-600 mb-4">Resumen rápido de tu perfil y acceso a edición.</p>
                <Link to="/perfil/1" className="px-4 py-2 bg-sportshausen-red text-white rounded-lg">Ver Perfil Completo</Link>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Calendario</h2>
                <p className="text-gray-600">Accede y modifica tu disponibilidad y eventos.</p>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Eventos</h2>
                <p className="text-gray-600">Tus próximos eventos y propuestas.</p>
              </div>
            )}

            {activeTab === 'offers' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Ofertas</h2>
                <p className="text-gray-600">Ofertas y contrataciones disponibles.</p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
                <p className="text-gray-600">Novedades y alertas relevantes.</p>
              </div>
            )}

            {/* Keep feed posts only when user selects Home (not default) */}
            {activeTab === 'home' && (
              <>
                {/* Post Creator */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-sportshausen-gold rounded-full flex items-center justify-center text-xl flex-shrink-0">
                      🔥
                    </div>
                    <input
                      type="text"
                      placeholder="¿Qué estás pensando?"
                      className="flex-1 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors focus:bg-white focus:ring-2 ring-sporthausen-secondary outline-none"
                    />
                  </div>
                </div>

                {/* Feed Posts */}
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                          {post.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sportshausen-dark">{post.author}</h4>
                          <p className="text-sm text-gray-600">{post.role}</p>
                          <p className="text-xs text-gray-400">{post.time}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

                    {/* Image placeholder */}
                    <div className="h-48 bg-gradient-to-br from-sportshausen-red to-red-700 rounded-lg mb-4 flex items-center justify-center text-4xl">
                      ⚡
                    </div>

                    {/* Stats & Actions truncated for brevity */}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Right Sidebar removed to simplify UI (more tool-like, less social) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="text-center text-xs text-gray-600 mt-6 space-y-1">
              <p>
                <a href="#" className="hover:text-sportshausen-red">Sobre</a>
                {' '} · {' '}
                <a href="#" className="hover:text-sportshausen-red">Accesibilidad</a>
              </p>
              <p>© 2026 SportsHausen</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FeedLuchador;

