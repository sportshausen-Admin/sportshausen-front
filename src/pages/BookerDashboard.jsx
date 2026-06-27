import React, { useState } from 'react';
import { Search, LogOut, Heart, Star, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';

export const BookerDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    experience: '',
    weight: '',
  });
  const currentUser = { displayName: 'User Booker' };
  const navigate = useNavigate();

  const luchadores = [
    { id: 1, nombre: 'Phoenix', ciudad: 'Santiago', exp: 8, rating: 4.8, img: '🔥' },
    { id: 2, nombre: 'Titán', ciudad: 'Valparaíso', exp: 5, rating: 4.5, img: '💪' },
    { id: 3, nombre: 'Rayo', ciudad: 'Concepción', exp: 6, rating: 4.7, img: '⚡' },
    { id: 4, nombre: 'Dragón', ciudad: 'Santiago', exp: 10, rating: 4.9, img: '🐉' },
    { id: 5, nombre: 'Sombra', ciudad: 'Valparaíso', exp: 4, rating: 4.6, img: '👻' },
    { id: 6, nombre: 'León', ciudad: 'Santiago', exp: 7, rating: 4.8, img: '🦁' },
  ];

  const sidebarItems = [
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'search', label: 'Buscar Talento', icon: '🔍' },
    { id: 'messages', label: 'Mis Mensajes', icon: '💬' },
    { id: 'contracts', label: 'Órdenes de Contratación', icon: '📋' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-sportshausen-light">
      <Header userType="booker" />

      <div className="flex h-screen pt-16">
        <SideNav active={activeTab} onSelect={(id)=>setActiveTab(id)} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 md:ml-64">
          {activeTab === 'home' && (
            <div>
              <h1 className="text-4xl font-bold text-sportshausen-dark mb-2">Descubre Nuevo Talento</h1>
              <p className="text-gray-600 mb-4">Estos son los luchadores destacados esta semana</p>
              
              <div className="flex gap-4 mb-8">
                <button onClick={() => navigate('/calendario-disponibilidad')} className="flex items-center gap-2 px-6 py-3 bg-sportshausen-red hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                  <Calendar size={20} />
                  Calendario
                </button>
              </div>

              {/* Featured Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {luchadores.slice(0, 3).map((luchador) => (
                  <div key={luchador.id} className="card-shadow bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="bg-gradient-to-r from-sportshausen-red to-sportshausen-gold h-32 flex items-center justify-center text-6xl">
                      {luchador.img}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-sportshausen-dark mb-2">{luchador.nombre}</h3>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(luchador.rating) ? 'fill-sportshausen-gold text-sportshausen-gold' : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">{luchador.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                        <MapPin size={16} className="text-sportshausen-red" />
                        {luchador.ciudad}
                      </p>
                      <button className="w-full btn-primary text-sm">Ver Perfil</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              <h1 className="text-4xl font-bold text-sportshausen-dark mb-8">Buscar Talento</h1>

              {/* Filters */}
              <div className="card-shadow bg-white rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-sportshausen-dark mb-4">Filtros Avanzados</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                      Ciudad
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none">
                      <option>Todas</option>
                      <option>Santiago</option>
                      <option>Valparaíso</option>
                      <option>Concepción</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                      Años de Experiencia
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none">
                      <option>Cualquiera</option>
                      <option>0-2 años</option>
                      <option>3-5 años</option>
                      <option>6+ años</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                      Rango de Peso
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none">
                      <option>Cualquiera</option>
                      <option>70-80 kg</option>
                      <option>80-90 kg</option>
                      <option>90+ kg</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button className="w-full btn-primary">Buscar</button>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {luchadores.map((luchador) => (
                  <div key={luchador.id} className="card-shadow bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="bg-gradient-to-r from-sportshausen-red to-sportshausen-gold h-32 flex items-center justify-center text-6xl">
                      {luchador.img}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-sportshausen-dark mb-2">{luchador.nombre}</h3>
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600">Experiencia</p>
                          <p className="font-semibold text-sportshausen-dark">{luchador.exp} años</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Calificación</p>
                          <p className="font-semibold text-sportshausen-dark">{luchador.rating}</p>
                        </div>
                      </div>
                      <button className="w-full btn-primary text-sm">Contactar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-6">Mensajes</h1>
              <div className="card-shadow bg-white p-6 rounded-lg text-center">
                <p className="text-gray-600 mb-4">Accede a tu bandeja de mensajes.</p>
                <a href="/mensajeria" className="btn-primary inline-block">Ir a Mensajería</a>
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-6">Órdenes de Contratación</h1>
              <div className="space-y-4">
                {[
                  { luchador: 'Phoenix', evento: 'Show Julio', fecha: '15 Jul', estado: 'Activo', monto: '$200.000' },
                  { luchador: 'Titán', evento: 'Noche de Campeones', fecha: '22 Jul', estado: 'Pendiente', monto: '$150.000' },
                  { luchador: 'Dragón', evento: 'FNL Doomsday', fecha: '23 May', estado: 'Completado', monto: '$180.000' },
                ].map((c, i) => (
                  <div key={i} className="card-shadow bg-white p-5 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sportshausen-dark">{c.luchador} — {c.evento}</p>
                      <p className="text-sm text-gray-500">{c.fecha}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-sportshausen-red">{c.monto}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        c.estado === 'Activo' ? 'badge-yellow' :
                        c.estado === 'Pendiente' ? 'badge-outline' :
                        'badge-dark'
                      }`}>{c.estado}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-6">Mi Perfil de Booker</h1>
              <div className="card-shadow bg-white p-6 rounded-lg space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                  <input defaultValue="User Booker" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input defaultValue="booker@sportshausen.cl" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Organización</label>
                  <input defaultValue="Booking Pro Events" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ciudad</label>
                  <input defaultValue="Santiago" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none" />
                </div>
                <button className="btn-primary">Guardar Cambios</button>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-6">Calendario de Eventos</h1>
              <div className="space-y-4">
                {[
                  { fecha: '15 Jul', evento: 'Show Julio', lugar: 'Santiago', luchadores: 6 },
                  { fecha: '22 Jul', evento: 'Noche de Campeones', lugar: 'Valparaíso', luchadores: 8 },
                  { fecha: '5 Ago', evento: 'Gran Final', lugar: 'Concepción', luchadores: 10 },
                ].map((ev, i) => (
                  <div key={i} className="card-shadow bg-white p-5 rounded-lg flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <Calendar className="text-sportshausen-red" size={20} />
                      <div>
                        <p className="font-bold text-sportshausen-dark">{ev.evento}</p>
                        <p className="text-sm text-gray-500">{ev.fecha} · {ev.lugar}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">{ev.luchadores} luchadores</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-6">Notificaciones</h1>
              <div className="space-y-3">
                {[
                  { msg: 'Phoenix aceptó tu propuesta', time: 'Hace 1h' },
                  { msg: 'Nuevo luchador disponible en Santiago', time: 'Hace 3h' },
                  { msg: 'Titán vio tu oferta', time: 'Ayer' },
                ].map((n, i) => (
                  <div key={i} className="card-shadow bg-white p-4 rounded-lg flex gap-3 items-center">
                    <div className="w-2 h-2 rounded-full bg-sportshausen-red flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-sportshausen-dark">{n.msg}</p>
                      <p className="text-xs text-gray-500">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        {/* Right welcome panel */}
        <aside className="w-72 hidden lg:block p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <p className="text-sm text-gray-500">Bienvenido de Vuelta,</p>
            <h3 className="text-xl font-bold text-sportshausen-dark mt-2">{currentUser.displayName}</h3>
            <p className="text-sm text-gray-600 mt-3">Administra eventos y descubre talento desde aquí.</p>
            <div className="mt-4">
              <button className="w-full btn-primary">Ir a Mi Perfil</button>
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default BookerDashboard;

