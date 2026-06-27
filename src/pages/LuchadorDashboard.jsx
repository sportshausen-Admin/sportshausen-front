import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import { CalendarioDisponibilidad } from './CalendarioDisponibilidad';
import { getPostulacionesLuchador, getNotificacionesLuchador } from '../services/postulacionesService';

const LuchadorDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [misEventos, setMisEventos] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const navigate = useNavigate();

  const luchadorId = localStorage.getItem('userId');
  const currentUser = {
    displayName: (() => {
      try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return u.nombre_artistico || u.full_name || u.name || 'Luchador'; } catch { return 'Luchador'; }
    })()
  };

  useEffect(() => {
    const postulaciones = getPostulacionesLuchador(luchadorId);
    setMisEventos(postulaciones.filter(p => p.estado === 'ACEPTADA'));
    setNotificaciones(getNotificacionesLuchador(luchadorId));
  }, [luchadorId]);

  return (
    <div className="min-h-screen bg-sportshausen-light">
      <Header userType="luchador" isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex min-h-screen pt-16">
        <SideNav active={activeTab} onSelect={(id) => setActiveTab(id)} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="main-content flex-1 p-4 md:p-8 md:ml-64 transition-transform duration-300 ease-out overflow-y-auto">
          {activeTab === 'home' && (
            <div>
              <h1 className="text-4xl font-bold text-sportshausen-dark mb-4">¡Bienvenido, {currentUser.displayName}!</h1>
              
              <div className="flex gap-4 mb-8">
                <button onClick={() => navigate('/calendario-disponibilidad')} className="flex items-center gap-2 px-6 py-3 bg-sportshausen-red hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                  <Calendar size={20} />
                  Calendario
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Eventos Programados', value: '3' },
                  { label: 'Eventos Participados', value: '20' },
                  { label: 'Calificación', value: '4.8' },
                  { label: 'Visualizaciones del último mes', value: '156' },
                ].map((stat, i) => (
                  <div key={i} className="card-shadow bg-white p-6 rounded-lg">
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-sportshausen-dark">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="card-shadow bg-white p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-sportshausen-dark mb-4">Próxima Aparición</h2>
                  <p className="text-gray-700">FNL Doomsday, 23 de Mayo, 14:00 Hrs</p>
                  <div className="mt-4">
                    <button onClick={() => navigate('/mis-eventos')} className="btn-subtle">Ver Mis Eventos</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="card-shadow bg-white p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-sportshausen-dark mb-6">Más Fechas</h2>
                  {[
                    { date: '30 Mayo', event: 'Batalla Nocturna', loc: 'Santiago', group: '5 Luchas Clandestino' },
                    { date: '12 Junio', event: 'WKC Showdown', loc: 'Valparaíso', group: 'WKC' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      <Calendar className="text-sportshausen-red" size={20} />
                      <div>
                        <p className="font-semibold">{item.group} — {item.event}</p>
                        <p className="text-sm text-gray-600">{item.date} • {item.loc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-shadow bg-white p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-sportshausen-dark mb-6">Visualizaciones</h2>
                  {[
                    { viewer: 'FNL', msg: 'ha visto tu perfil', time: 'Hace 2h' },
                    { viewer: 'WKC', msg: 'ha visto tu perfil', time: 'Hace 5h' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 pb-4 border-b border-gray-200 last:border-0">
                      <div className="w-10 h-10 bg-sportshausen-gold rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {item.viewer[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{item.viewer}</p>
                        <p className="text-sm text-gray-600">{item.viewer} {item.msg}</p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <div className="card-shadow bg-white p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-sportshausen-dark mb-4">Ofertas</h2>
                  <p className="text-gray-700">Mira las últimas ofertas que han aparecido en el portal</p>
                  <div className="mt-4">
                    <button onClick={() => navigate('/ofertas')} className="btn-primary">Ir a Ofertas</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-4">Bienvenido de vuelta, {currentUser.displayName}</h1>
              <p className="text-gray-600 mb-6">Accede a tu perfil completo, edítalo y gestiona tu presencia profesional.</p>
              <div className="card-shadow bg-white p-6 rounded-lg">Contenido del perfil (usa la página de Perfil para más detalle)</div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              <CalendarioDisponibilidad embedded />
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-6">Mis Eventos Confirmados</h1>
              {misEventos.length === 0 ? (
                <div className="card-shadow bg-white rounded-lg p-10 text-center text-gray-500">
                  <p>No tienes eventos confirmados aún.</p>
                  <button onClick={() => navigate('/ofertas')} className="btn-primary mt-4">Ver Ofertas</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {misEventos.map((ev) => {
                    const fecha = ev.evento_fecha
                      ? `${ev.evento_fecha.date}/${ev.evento_fecha.month + 1}/${ev.evento_fecha.year}`
                      : '';
                    return (
                      <div key={ev.id} className="card-shadow bg-white p-5 rounded-lg flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                          <Calendar className="text-sportshausen-red flex-shrink-0" size={20} />
                          <div>
                            <p className="font-bold text-sportshausen-dark">{ev.evento_nombre}</p>
                            <p className="text-sm text-gray-500">{fecha}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold badge-yellow">
                          Confirmado
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'offers' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-6">Ofertas Disponibles</h1>
              <div className="space-y-4">
                {[
                  { org: 'FNL', desc: 'Luchador para evento estelar', fecha: '20 Jun', tarifa: '$150.000 CLP' },
                  { org: 'WKC', desc: 'Combate de campeonato abierto', fecha: '5 Jul', tarifa: '$200.000 CLP' },
                  { org: '5LC', desc: 'Lucha de apertura de show', fecha: '12 Jul', tarifa: '$80.000 CLP' },
                ].map((of, i) => (
                  <div key={i} className="card-shadow bg-white p-5 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-sportshausen-dark">{of.org} — {of.desc}</p>
                        <p className="text-sm text-gray-500">{of.fecha}</p>
                      </div>
                      <p className="font-bold text-sportshausen-red text-sm">{of.tarifa}</p>
                    </div>
                    <button className="btn-primary text-sm px-4 py-2">Postular</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-4">Mensajes</h1>
              <div className="card-shadow bg-white p-6 rounded-lg text-center">
                <p className="text-gray-600 mb-4">Accede a tu bandeja de mensajes completa.</p>
                <Link to="/mensajeria" className="btn-primary inline-block">Ir a Mensajería</Link>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-6">Notificaciones</h1>
              {notificaciones.length === 0 ? (
                <div className="card-shadow bg-white rounded-lg p-10 text-center text-gray-500">
                  Sin notificaciones.
                </div>
              ) : (
                <div className="space-y-3">
                  {notificaciones.map((n) => (
                    <div key={n.id} className="card-shadow bg-white p-4 rounded-lg flex gap-3 items-center">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${n.msg.includes('ACEPTADA') ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-sportshausen-dark">{n.msg}</p>
                        <p className="text-xs text-gray-500">{new Date(n.fecha).toLocaleString('es-CL')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* right panel removed to make main full width */}
      </div>
      <Footer />
    </div>
  );
};

export default LuchadorDashboard;
