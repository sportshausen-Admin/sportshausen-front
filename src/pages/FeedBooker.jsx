import React, { useState } from 'react';
import { Search, Home, Users, Calendar, Trophy, MessageCircle, Bell, Briefcase, MoreHorizontal, Heart, MessageSquare, Share2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export const FeedBooker = () => {
  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (postId) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const opportunities = [
    {
      id: 1,
      title: 'Buscamos 2 Luchadores para Evento Regional',
      author: 'Agrupación Elite',
      avatar: '⭐',
      time: 'Hace 1 hora',
      date: '15 de Mayo',
      location: 'Santiago',
      description: 'Evento profesional de lucha libre. Se requiere experiencia mínima de 3 años. Excelente paga y condiciones. ¡Aplica ahora!',
      applicants: 23,
      likes: 456
    },
    {
      id: 2,
      title: 'Lucha de Campeonato - Buscamos Campeones',
      author: 'Events Pro',
      avatar: '🎪',
      time: 'Hace 3 horas',
      date: '22 de Mayo',
      location: 'Valparaíso',
      description: 'Torneo de lucha libre con participantes de todo el país. Premio final: $5M. ¿Te atreves a competir?',
      applicants: 67,
      likes: 1203
    },
    {
      id: 3,
      title: 'Evento Especial - Se Buscan Talentos Nuevos',
      author: 'Lucha Premium',
      avatar: '✨',
      time: 'Hace 5 horas',
      date: '29 de Mayo',
      location: 'Concepción',
      description: 'Oportunidad para mostrar tu talento. Evento transmitido en vivo. Todos los talentos bienvenidos.',
      applicants: 34,
      likes: 789
    },
  ];

  const topTalent = [
    { name: 'Phoenix', exp: '8 años', rating: 4.8, avatar: '🔥', events: 45 },
    { name: 'El Titán', exp: '5 años', rating: 4.7, avatar: '💪', events: 32 },
    { name: 'Rayo Plateado', exp: '6 años', rating: 4.9, avatar: '⚡', events: 28 },
    { name: 'Dragón Negro', exp: '10 años', rating: 4.6, avatar: '🐉', events: 67 },
  ];

  return (
    <div className="min-h-screen bg-sporthausen-neutral-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-sportshausen-red to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="hidden sm:inline text-sportshausen-dark">SportsHausen</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Busca talentos, eventos..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:bg-white focus:ring-2 ring-sporthausen-secondary outline-none transition-all"
                />
              </div>
            </div>

            {/* Navigation Icons */}
            <nav className="flex items-center gap-1 md:gap-2">
              <button className="p-2 hover:bg-sporthausen-neutral-light rounded-full transition-colors group" title="Inicio">
                <Home size={20} className="text-gray-600 group-hover:text-sportshausen-red" />
              </button>
              <button className="p-2 hover:bg-sporthausen-neutral-light rounded-full transition-colors group" title="Talentos">
                <Users size={20} className="text-gray-600 group-hover:text-sportshausen-red" />
              </button>
              <button className="p-2 hover:bg-sporthausen-neutral-light rounded-full transition-colors group" title="Mis eventos">
                <Calendar size={20} className="text-gray-600 group-hover:text-sportshausen-red" />
              </button>
              <button className="p-2 hover:bg-sporthausen-neutral-light rounded-full transition-colors group" title="Contrataciones">
                <Briefcase size={20} className="text-gray-600 group-hover:text-sportshausen-red" />
              </button>
              <button className="p-2 hover:bg-sporthausen-neutral-light rounded-full transition-colors group relative" title="Mensajes">
                <MessageCircle size={20} className="text-gray-600 group-hover:text-sportshausen-red" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-sportshausen-red rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-sporthausen-neutral-light rounded-full transition-colors group relative" title="Notificaciones">
                <Bell size={20} className="text-gray-600 group-hover:text-sportshausen-red" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-sportshausen-red rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 ring-sportshausen-red transition-all">
                B
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Booker Profile Card */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
              {/* Banner */}
              <div className="h-20 bg-gradient-to-r from-blue-500 to-blue-700"></div>
              
              {/* Content */}
              <div className="px-6 pb-4 -mt-8">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-3 border-4 border-white shadow-md">
                  📋
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-center text-sportshausen-dark">Agrupación Elite</h3>
                <p className="text-sm text-gray-600 text-center mb-4">Organizador de Eventos</p>

                {/* Stats */}
                <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eventos creados</span>
                    <span className="font-bold text-sportshausen-red">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Talentos contactados</span>
                    <span className="font-bold text-sportshausen-red">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-bold text-sportshausen-red">4.9 ⭐</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 py-2 bg-sportshausen-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm">
                  Publicar Evento
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm mt-6 p-4">
              <h3 className="font-bold text-sportshausen-dark mb-4">📊 Análisis</h3>
              <div className="space-y-3">
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-600">Solicitudes esta semana</p>
                  <p className="text-2xl font-bold text-sportshausen-red">34</p>
                </div>
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-600">Mensajes sin leer</p>
                  <p className="text-2xl font-bold text-sportshausen-red">12</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Tasa de aceptación</p>
                  <p className="text-2xl font-bold text-sportshausen-red">87%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Feed */}
          <div className="lg:col-span-2">
            {/* Create Event Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  📋
                </div>
                <input
                  type="text"
                  placeholder="¿Necesitas talentos? Publica tu evento aquí..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors focus:bg-white focus:ring-2 ring-sporthausen-secondary outline-none"
                />
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-sporthausen-neutral-light rounded transition-colors">
                  <Calendar size={18} />
                  <span className="text-sm">Evento</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-sporthausen-neutral-light rounded transition-colors">
                  <Users size={18} />
                  <span className="text-sm">Busco Talento</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-sporthausen-neutral-light rounded transition-colors">
                  <Zap size={18} />
                  <span className="text-sm">Urgente</span>
                </button>
              </div>
            </div>

            {/* Opportunities */}
            {opportunities.map((opp) => (
              <div key={opp.id} className="bg-white rounded-lg shadow-sm p-6 mb-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                      {opp.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sportshausen-dark">{opp.author}</h4>
                      <p className="text-sm text-gray-600">Publicado {opp.time}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-sporthausen-neutral-light rounded transition-colors">
                    <MoreHorizontal size={18} className="text-gray-400" />
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-sportshausen-dark mb-2">{opp.title}</h3>

                {/* Details */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} className="text-sportshausen-red" />
                    <span>{opp.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} className="text-sportshausen-red" />
                    <span>{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={16} className="text-sportshausen-red" />
                    <span>{opp.applicants} solicitudes</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-800 mb-4 leading-relaxed">{opp.description}</p>

                {/* Image Placeholder */}
                <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center text-4xl">
                  📢
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm text-gray-600 py-3 border-y border-gray-200 mb-3">
                  <span>👍 {opp.likes}</span>
                  <span>💬 {opp.applicants}</span>
                  <span>↗️ Compartir</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleLike(opp.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded transition-colors font-semibold ${
                      likedPosts.includes(opp.id)
                        ? 'text-sportshausen-red bg-red-50'
                        : 'text-gray-600 hover:bg-sporthausen-neutral-light'
                    }`}
                  >
                    <Heart size={18} className={likedPosts.includes(opp.id) ? 'fill-sportshausen-red' : ''} />
                    Me interesa
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-sporthausen-neutral-light rounded transition-colors font-semibold">
                    <MessageSquare size={18} />
                    Ver Solicitudes
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-sporthausen-neutral-light rounded transition-colors font-semibold">
                    <Share2 size={18} />
                    Compartir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar - Top Talent */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h3 className="font-bold text-sportshausen-dark mb-4">🌟 Talentos Top</h3>
              <div className="space-y-4">
                {topTalent.map((talent, i) => (
                  <div key={i} className="flex items-start justify-between pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex gap-2 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        {talent.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{talent.name}</p>
                        <p className="text-xs text-gray-600">{talent.exp}</p>
                        <p className="text-xs text-sportshausen-red font-semibold">{talent.rating} ⭐</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-sportshausen-red text-white rounded-full text-xs font-semibold hover:bg-red-700 transition-colors flex-shrink-0">
                      Contactar
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 border-2 border-sportshausen-red text-sportshausen-red rounded-lg font-semibold hover:bg-red-50 transition-colors text-sm">
                Ver Más Talentos
              </button>
            </div>

            {/* Footer Info */}
            <div className="text-center text-xs text-gray-600 mt-6 space-y-1">
              <p>
                <a href="#" className="hover:text-sportshausen-red">Sobre</a>
                {' '} · {' '}
                <a href="#" className="hover:text-sportshausen-red">Ayuda</a>
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

export default FeedBooker;

