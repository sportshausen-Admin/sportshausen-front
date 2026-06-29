import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import { getEventos, actualizarEvento } from '../services/eventosService';
import {
  getPostulacionesAgrupacion,
  aceptarPostulacion,
  rechazarPostulacion,
  agregarNotificacionLuchador,
} from '../services/postulacionesService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const registrarMarcaCalendario = async (luchador_id, fechaStr, razon) => {
  try {
    const token = sessionStorage.getItem('authToken');
    await fetch(`${API_BASE}/api/disponibilidad/pendientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ luchador_id, fechaStr, razon }),
    });
  } catch { /* no bloquear el flujo principal */ }
};
import { crearConversacion, enviarMensaje } from '../services/mensajeriaService';

const fmtFecha = ({ date, month, year }) => {
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${date} ${meses[month]} ${year}`;
};

const toMs = ({ date, month, year }) => new Date(year, month, date).getTime();

const AgrupacionDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => location.state?.tab || 'home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [procesando, setProcesando] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Cuando React Router navega a esta página con state.tab (ej: desde SideNav),
  // actualizar el tab activo sin necesidad de recargar
  useEffect(() => {
    if (location.state?.tab) setActiveTab(location.state.tab);
  }, [location.state?.tab]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const agrupacionId = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}').id || localStorage.getItem('userId') || 0; }
    catch { return 0; }
  })();

  // Nombre artistico desde localStorage
  const nombreArtistico = (() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return u.nombre_artistico || u.full_name || u.name || 'tu agrupación';
    } catch { return 'tu agrupación'; }
  })();

  useEffect(() => {
    getEventos().then(setEventos).catch(() => {});
  }, []);

  useEffect(() => {
    setPostulaciones(getPostulacionesAgrupacion(agrupacionId));
  }, [agrupacionId]);

  const recargarPostulaciones = () =>
    setPostulaciones(getPostulacionesAgrupacion(agrupacionId));

  const handleAceptar = async (postulacion) => {
    setProcesando(postulacion.id);
    try {
      aceptarPostulacion(postulacion.id);

      // Buscar la fecha del evento en el estado local
      const eventoObj = eventos.find(ev => String(ev.id) === String(postulacion.evento_id));
      const eventoFecha = eventoObj?.fecha || null;

      // Notificación estructurada al luchador
      agregarNotificacionLuchador(
        postulacion.luchador_id,
        `✅ Tu postulación al evento "${postulacion.evento_nombre}" ha sido ACEPTADA.`,
        {
          tipo: 'postulacion_aceptada',
          evento_nombre: postulacion.evento_nombre,
          evento_fecha: eventoFecha,
        }
      );

      // Descontar una vacante en Xano
      if (eventoObj && (eventoObj.luchadores ?? 0) > 0) {
        try {
          const nuevasVacantes = eventoObj.luchadores - 1;
          await actualizarEvento(eventoObj.id, { ...eventoObj, luchadores: nuevasVacantes });
          setEventos(prev => prev.map(ev =>
            String(ev.id) === String(eventoObj.id) ? { ...ev, luchadores: nuevasVacantes } : ev
          ));
        } catch { /* no bloquear el flujo si falla el update */ }
      }

      // Registrar marca en el servidor para que el luchador la vea al abrir su calendario
      if (eventoFecha) {
        const { date, month, year } = eventoFecha;
        const fechaStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        await registrarMarcaCalendario(
          postulacion.luchador_id,
          fechaStr,
          `Evento confirmado: ${postulacion.evento_nombre}`
        );
      }
      // Enviar mensaje por mensajería
      try {
        const conv = await crearConversacion(postulacion.luchador_id);
        const convId = conv?.id || conv?.conversacion_id;
        if (convId) {
          await enviarMensaje(convId, `¡Hola! Tu postulación al evento "${postulacion.evento_nombre}" ha sido ACEPTADA. Bienvenido al equipo.`);
        }
      } catch { /* mensajería puede fallar sin romper el flujo */ }
      recargarPostulaciones();
      showToast('Postulación aceptada. Se notificó al luchador.');
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setProcesando(null);
    }
  };

  const handleRechazar = (postulacion) => {
    rechazarPostulacion(postulacion.id);
    agregarNotificacionLuchador(
      postulacion.luchador_id,
      `❌ Tu postulación al evento "${postulacion.evento_nombre}" ha sido rechazada.`
    );
    recargarPostulaciones();
    showToast('Postulación rechazada.');
  };

  // Stats calculadas desde eventos reales
  const hoy = new Date();
  const hoyMs = hoy.getTime();
  const en30Ms = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 30).getTime();

  const eventosProgramados = eventos.filter(ev => {
    const ms = toMs(ev.fecha);
    return ms >= hoyMs && ms <= en30Ms;
  });

  const proximoEvento = eventos
    .filter(ev => toMs(ev.fecha) >= hoyMs)
    .sort((a, b) => toMs(a.fecha) - toMs(b.fecha))[0];

  const siguientesEventos = eventos
    .filter(ev => {
      const ms = toMs(ev.fecha);
      return ms >= hoyMs && ev.id !== proximoEvento?.id;
    })
    .sort((a, b) => toMs(a.fecha) - toMs(b.fecha))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-sportshausen-light">
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.type === 'error' ? '✕ ' : '✓ '}{toast.msg}
        </div>
      )}
      <Header userType="agrupacion" isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex min-h-screen pt-16">
        <SideNav active={activeTab} onSelect={(id) => setActiveTab(id)} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="main-content flex-1 p-4 md:p-8 md:ml-64 transition-transform duration-300 ease-out overflow-y-auto">
          {activeTab === 'home' && (
            <div>
              <h1 className="text-4xl font-bold text-sportshausen-dark mb-4">
                Bienvenido, {nombreArtistico}!
              </h1>

              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => navigate('/agenda/agrupacion')}
                  className="flex items-center gap-2 px-6 py-3 bg-sportshausen-red hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Calendar size={20} />
                  Agenda de Eventos
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card-shadow bg-white p-6 rounded-lg">
                  <p className="text-gray-600 text-sm">Eventos Programados (30 días)</p>
                  <p className="text-3xl font-bold text-sportshausen-dark">{eventosProgramados.length}</p>
                </div>
                <div className="card-shadow bg-white p-6 rounded-lg">
                  <p className="text-gray-600 text-sm">Eventos Publicados</p>
                  <p className="text-3xl font-bold text-sportshausen-dark">{eventos.length}</p>
                </div>
                <div className="card-shadow bg-white p-6 rounded-lg">
                  <p className="text-gray-600 text-sm">Calificación</p>
                  <p className="text-3xl font-bold text-sportshausen-dark">4.9</p>
                </div>
                <div className="card-shadow bg-white p-6 rounded-lg">
                  <p className="text-gray-600 text-sm">Visualizaciones del último mes</p>
                  <p className="text-3xl font-bold text-sportshausen-dark">482</p>
                </div>
              </div>

              <div className="mt-8">
                <div className="card-shadow bg-white p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-sportshausen-dark mb-4">Próximo Evento Programado</h2>
                  {proximoEvento ? (
                    <>
                      <p className="text-gray-700 font-semibold">{proximoEvento.nombre}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {fmtFecha(proximoEvento.fecha)}
                        {proximoEvento.horaInicio && ` · ${proximoEvento.horaInicio}`}
                        {proximoEvento.duracion && ` · ${proximoEvento.duracion} min`}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">No hay eventos próximos cargados.</p>
                  )}
                  <div className="mt-4">
                    <button onClick={() => navigate('/agenda/agrupacion')} className="btn-subtle">
                      Ver Agenda
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="card-shadow bg-white p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-sportshausen-dark mb-6">Siguientes Eventos</h2>
                  {siguientesEventos.length > 0 ? (
                    siguientesEventos.map((ev) => (
                      <div key={ev.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                        <Calendar className="text-sportshausen-red flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold">{ev.nombre}</p>
                          <p className="text-sm text-gray-600">{fmtFecha(ev.fecha)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Sin eventos próximos.</p>
                  )}
                </div>

                <div className="card-shadow bg-white p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-sportshausen-dark mb-4">Postulaciones Recibidas</h2>
                  {postulaciones.length === 0 ? (
                    <p className="text-gray-400 text-sm">Sin postulaciones pendientes.</p>
                  ) : (
                    <>
                      <p className="text-3xl font-black text-sportshausen-red mb-1">
                        {postulaciones.filter(p => p.estado === 'PENDIENTE').length}
                      </p>
                      <p className="text-gray-500 text-sm mb-4">pendiente{postulaciones.filter(p => p.estado === 'PENDIENTE').length !== 1 ? 's' : ''} de revisión</p>
                    </>
                  )}
                  <button onClick={() => setActiveTab('postulaciones')} className="btn-subtle text-sm">
                    Ver postulaciones →
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="card-shadow bg-white p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-sportshausen-dark mb-4">Eventos Publicados</h2>
                  <p className="text-gray-700">Gestiona tus eventos y revisa las postulaciones recibidas.</p>
                  <div className="mt-4">
                    <button onClick={() => navigate('/agenda/agrupacion')} className="btn-primary">
                      Ir a Eventos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-6">Perfil de Agrupación</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario */}
                <div className="lg:col-span-2 card-shadow bg-white p-6 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de la Agrupación</label>
                    <input defaultValue={nombreArtistico} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      defaultValue={(() => { try { return JSON.parse(localStorage.getItem('user') || '{}').email || ''; } catch { return ''; } })()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ciudad</label>
                    <input defaultValue="Santiago" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                    <textarea rows="3" defaultValue="Agrupación organizadora de eventos deportivos." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none" />
                  </div>
                  <button className="btn-primary">Guardar Cambios</button>
                </div>

                {/* Panel derecho — Vista Previa */}
                <div className="space-y-4">
                  <div className="card-shadow bg-white rounded-2xl overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-sportshausen-red to-sportshausen-dark" />
                    <div className="p-5 -mt-8">
                      <div className="w-16 h-16 rounded-2xl bg-sportshausen-gold flex items-center justify-center text-white text-2xl font-black shadow mb-3">
                        {nombreArtistico[0]?.toUpperCase() || 'A'}
                      </div>
                      <p className="font-bold text-sportshausen-dark text-lg">{nombreArtistico}</p>
                      <p className="text-xs text-gray-500 mb-3">Agrupación · Santiago</p>
                      <div className="border-t pt-3 space-y-1 text-sm text-gray-600">
                        <p>📅 {eventos.length} evento{eventos.length !== 1 ? 's' : ''} publicado{eventos.length !== 1 ? 's' : ''}</p>
                        <p>⭐ 4.9 calificación</p>
                      </div>
                    </div>
                  </div>

                  {/* Calendario de días con eventos */}
                  <div className="card-shadow bg-white rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Días con eventos</p>
                    {eventos.length === 0 ? (
                      <p className="text-xs text-gray-400">Sin eventos cargados.</p>
                    ) : (
                      <ul className="space-y-1 text-xs text-gray-600 max-h-40 overflow-y-auto">
                        {eventos
                          .filter(ev => toMs(ev.fecha) >= hoyMs)
                          .sort((a, b) => toMs(a.fecha) - toMs(b.fecha))
                          .map(ev => (
                            <li key={ev.id} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-sportshausen-red flex-shrink-0" />
                              <span className="font-medium">{fmtFecha(ev.fecha)}</span>
                              <span className="text-gray-400">— {ev.nombre}</span>
                            </li>
                          ))
                        }
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-2">Agenda de Eventos</h1>
              <p className="text-gray-500 mb-6">Administra el calendario de eventos de tu agrupación.</p>
              <div className="card-shadow bg-white p-8 rounded-2xl flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-sportshausen-gold/15 flex items-center justify-center">
                  <Calendar size={32} className="text-sportshausen-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-sportshausen-dark mb-1">Calendario interactivo</h2>
                  <p className="text-gray-500 text-sm max-w-sm">
                    Crea, edita y elimina eventos directamente desde el calendario.
                  </p>
                </div>
                <button onClick={() => navigate('/agenda/agrupacion')} className="btn-primary flex items-center gap-2">
                  <Calendar size={18} />
                  Ir a la Agenda
                </button>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-6">Gestionar Eventos</h1>
              {eventos.length === 0 ? (
                <p className="text-gray-500">Sin eventos. Crea uno desde la Agenda.</p>
              ) : (
                <div className="space-y-4">
                  {eventos
                    .sort((a, b) => toMs(a.fecha) - toMs(b.fecha))
                    .map((ev) => (
                      <div key={ev.id} className="card-shadow bg-white p-5 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sportshausen-dark">{ev.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {fmtFecha(ev.fecha)}
                            {ev.horaInicio && ` · ${ev.horaInicio}`}
                            {ev.luchadores && ` · ${ev.luchadores} luchadores`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold badge-yellow">
                            Publicado
                          </span>
                          <button
                            onClick={() => navigate('/agenda/agrupacion')}
                            className="text-sm text-sportshausen-red font-semibold hover:underline"
                          >
                            Editar
                          </button>
                        </div>
                      </div>
                    ))
                  }
                  <button onClick={() => navigate('/agenda/agrupacion')} className="btn-primary mt-2">
                    + Crear Nuevo Evento
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'postulaciones' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-sportshausen-dark">Postulaciones Recibidas</h1>
                  <p className="text-gray-500 text-sm mt-1">Luchadores que se han postulado a tus eventos</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                    {postulaciones.filter(p => p.estado === 'PENDIENTE').length} pendiente{postulaciones.filter(p => p.estado === 'PENDIENTE').length !== 1 ? 's' : ''}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                    {postulaciones.length} total
                  </span>
                </div>
              </div>

              {postulaciones.length === 0 ? (
                <div className="card-shadow bg-white rounded-xl p-12 text-center">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="text-gray-600 font-semibold">Sin postulaciones aún</p>
                  <p className="text-gray-400 text-sm mt-1">Cuando un luchador se postule a uno de tus eventos, aparecerá aquí.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {postulaciones
                    .sort((a, b) => {
                      if (a.estado === 'PENDIENTE' && b.estado !== 'PENDIENTE') return -1;
                      if (b.estado === 'PENDIENTE' && a.estado !== 'PENDIENTE') return 1;
                      return b.id - a.id;
                    })
                    .map(p => (
                      <div key={p.id} className="card-shadow bg-white rounded-xl overflow-hidden">
                        {/* Header de la tarjeta */}
                        <div className={`h-1 ${p.estado === 'ACEPTADA' ? 'bg-green-500' : p.estado === 'RECHAZADA' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-sportshausen-gold flex items-center justify-center text-white text-xl font-black flex-shrink-0">
                                {p.luchador_nombre?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <p className="font-bold text-sportshausen-dark text-lg leading-tight">{p.luchador_nombre}</p>
                                <p className="text-sm text-sportshausen-red font-semibold">
                                  📌 {p.evento_nombre}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{new Date(p.fecha).toLocaleString('es-CL')}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                              p.estado === 'ACEPTADA'  ? 'bg-green-100 text-green-700' :
                              p.estado === 'RECHAZADA' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {p.estado === 'PENDIENTE' ? '⏳ Pendiente' : p.estado === 'ACEPTADA' ? '✅ Aceptada' : '❌ Rechazada'}
                            </span>
                          </div>

                          {/* Datos del luchador */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 rounded-xl p-4 mb-4">
                            {p.luchador_ciudad    && (
                              <div className="text-center">
                                <p className="text-xs text-gray-400">Ciudad</p>
                                <p className="text-sm font-semibold text-sportshausen-dark">📍 {p.luchador_ciudad}</p>
                              </div>
                            )}
                            {p.luchador_peso      && (
                              <div className="text-center">
                                <p className="text-xs text-gray-400">Peso</p>
                                <p className="text-sm font-semibold text-sportshausen-dark">⚖️ {p.luchador_peso} kg</p>
                              </div>
                            )}
                            {p.luchador_estatura  && (
                              <div className="text-center">
                                <p className="text-xs text-gray-400">Estatura</p>
                                <p className="text-sm font-semibold text-sportshausen-dark">📏 {p.luchador_estatura} cm</p>
                              </div>
                            )}
                            {p.luchador_experiencia && (
                              <div className="text-center">
                                <p className="text-xs text-gray-400">Experiencia</p>
                                <p className="text-sm font-semibold text-sportshausen-dark">⏱ {p.luchador_experiencia} años</p>
                              </div>
                            )}
                          </div>

                          {/* Botones acción */}
                          {p.estado === 'PENDIENTE' && (
                            <div className="flex gap-3 flex-wrap">
                              <button
                                onClick={() => handleAceptar(p)}
                                disabled={procesando === p.id}
                                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
                              >
                                <CheckCircle size={16} />
                                {procesando === p.id ? 'Procesando...' : 'Aceptar postulación'}
                              </button>
                              <button
                                onClick={() => handleRechazar(p)}
                                disabled={procesando === p.id}
                                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-semibold disabled:opacity-50 border border-red-200 transition-colors"
                              >
                                <XCircle size={16} />
                                Rechazar
                              </button>
                            </div>
                          )}

                          {p.estado !== 'PENDIENTE' && (
                            <p className="text-xs text-gray-400 italic">
                              {p.estado === 'ACEPTADA' ? 'Se notificó al luchador y se inició conversación en mensajería.' : 'Se notificó al luchador del rechazo.'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-4">Mensajes</h1>
              <div className="card-shadow bg-white p-6 rounded-lg text-center">
                <p className="text-gray-600 mb-4">Accede a tu bandeja de mensajes.</p>
                <a href="/mensajeria" className="btn-primary inline-block">Ir a Mensajería</a>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h1 className="text-3xl font-bold text-sportshausen-dark mb-2">Postulaciones Recibidas</h1>
              <p className="text-gray-500 mb-6">Luchadores que se han postulado a tus eventos.</p>

              {postulaciones.length === 0 ? (
                <div className="card-shadow bg-white rounded-lg p-10 text-center text-gray-500">
                  No hay postulaciones aún.
                </div>
              ) : (
                <div className="space-y-4">
                  {postulaciones
                    .sort((a, b) => b.id - a.id)
                    .map(p => (
                      <div key={p.id} className="card-shadow bg-white rounded-xl p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="font-bold text-sportshausen-dark text-lg">{p.luchador_nombre}</p>
                            <p className="text-sm text-sportshausen-red font-semibold">→ {p.evento_nombre}</p>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                            p.estado === 'ACEPTADA' ? 'bg-green-100 text-green-700' :
                            p.estado === 'RECHAZADA' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {p.estado}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg p-3">
                          {p.luchador_ciudad && <span>📍 {p.luchador_ciudad}</span>}
                          {p.luchador_peso && <span>⚖️ {p.luchador_peso} kg</span>}
                          {p.luchador_estatura && <span>📏 {p.luchador_estatura} cm</span>}
                          {p.luchador_experiencia && <span>⏱ {p.luchador_experiencia} años exp.</span>}
                        </div>

                        <p className="text-xs text-gray-400 mb-3">
                          {new Date(p.fecha).toLocaleString('es-CL')}
                        </p>

                        {p.estado === 'PENDIENTE' && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleAceptar(p)}
                              disabled={procesando === p.id}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                            >
                              <CheckCircle size={16} />
                              {procesando === p.id ? 'Procesando...' : 'Aceptar postulación'}
                            </button>
                            <button
                              onClick={() => handleRechazar(p)}
                              disabled={procesando === p.id}
                              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold disabled:opacity-50"
                            >
                              <XCircle size={16} />
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AgrupacionDashboard;
