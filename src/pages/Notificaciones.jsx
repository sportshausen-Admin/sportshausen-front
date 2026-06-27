import React, { useState, useEffect } from 'react';
import { Bell, Eye, Briefcase, Calendar, MessageCircle, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import { marcarNotificacionLeida } from '../services/postulacionesService';

const iconMap = {
  vista: Eye, oferta: Briefcase, evento: Calendar,
  mensaje: MessageCircle, sistema: CheckCircle,
  postulacion_aceptada: CheckCircle, nueva_postulacion: Briefcase,
};
const colorMap = {
  vista: 'bg-sportshausen-gold', oferta: 'bg-sportshausen-red',
  evento: 'bg-sportshausen-dark', mensaje: 'bg-sportshausen-red',
  sistema: 'bg-gray-400', postulacion_aceptada: 'bg-green-500',
  nueva_postulacion: 'bg-blue-500',
};

const STORAGE_KEY = 'sportshausen_notifs';
const LUCHADOR_NOTIF_PREFIX = 'sh_notificaciones_luchador_';
const AGRUPACION_NOTIF_PREFIX = 'sh_notificaciones_agrupacion_';

const defaultNotifsLuchador = [
  { id: 1, tipo: 'vista', titulo: 'FNL vio tu perfil', desc: 'La Federación Nacional de Lucha revisó tu perfil completo.', time: 'Hace 2h', leida: false },
  { id: 2, tipo: 'oferta', titulo: 'Nueva oferta de WKC', desc: 'World Kombat Championship publicó una oferta que coincide con tu perfil.', time: 'Hace 4h', leida: false },
  { id: 3, tipo: 'evento', titulo: 'Evento confirmado', desc: 'Tu participación en FNL Doomsday el 23 de Mayo fue confirmada.', time: 'Ayer', leida: false },
  { id: 4, tipo: 'mensaje', titulo: 'Nuevo mensaje de Booker Carlos', desc: 'Te envió una propuesta de contrato para el Show Julio.', time: 'Ayer', leida: true },
  { id: 5, tipo: 'vista', titulo: 'Agrupación Elite vio tu perfil', desc: 'Revisaron tu historial y calificaciones.', time: 'Hace 2 días', leida: true },
  { id: 6, tipo: 'sistema', titulo: 'Perfil verificado', desc: 'Tu perfil ha sido verificado exitosamente por el equipo de SportsHausen.', time: 'Hace 3 días', leida: true },
];

const defaultNotifsAgrupacion = [
  { id: 1, tipo: 'sistema', titulo: 'Bienvenido a SportsHausen', desc: 'Tu cuenta de agrupación ha sido configurada. ¡Comienza a gestionar eventos!', time: 'Hoy', leida: false },
];

const defaultNotifsBooker = [
  { id: 1, tipo: 'sistema', titulo: 'Bienvenido a SportsHausen', desc: 'Tu cuenta de booker ha sido configurada.', time: 'Hoy', leida: false },
];

const getUserId = () => {
  try { return JSON.parse(localStorage.getItem('user') || '{}').id || localStorage.getItem('userId') || null; }
  catch { return null; }
};

const getUserType = () => {
  try { return localStorage.getItem('userType') || 'luchador'; }
  catch { return 'luchador'; }
};

const getDefaultNotifs = (userType) => {
  if (userType === 'agrupacion') return defaultNotifsAgrupacion;
  if (userType === 'booker') return defaultNotifsBooker;
  return defaultNotifsLuchador;
};

const formatRelTime = (iso) => {
  try {
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 3600) return `Hace ${Math.max(1, Math.floor(diff / 60))} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    if (diff < 172800) return 'Ayer';
    return `Hace ${Math.floor(diff / 86400)} días`;
  } catch { return ''; }
};

const loadNotifs = () => {
  const userId = getUserId();
  const userType = getUserType();
  const defaults = getDefaultNotifs(userType);

  // Notificaciones del sistema (mock + guardadas)
  const systemRaw = (() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : defaults; }
    catch { return defaults; }
  })().map(n => ({ ...n, _source: 'system' }));

  // Notificaciones de postulaciones del luchador
  const luchadorRaw = (userType === 'luchador' && userId) ? (() => {
    try { return JSON.parse(localStorage.getItem(`${LUCHADOR_NOTIF_PREFIX}${userId}`) || '[]'); }
    catch { return []; }
  })() : [];

  // Notificaciones de postulaciones recibidas para agrupación
  const agrupacionRaw = (userType === 'agrupacion' && userId) ? (() => {
    try { return JSON.parse(localStorage.getItem(`${AGRUPACION_NOTIF_PREFIX}${userId}`) || '[]'); }
    catch { return []; }
  })() : [];

  const roleRaw = userType === 'agrupacion' ? agrupacionRaw : luchadorRaw;

  const postulNormalized = roleRaw.map(n => ({
    id: n.id,
    tipo: n.tipo || 'sistema',
    titulo: n.msg?.split('\n')[0]?.replace(/^[✅❌⏳📋]\s*/, '') || 'Notificación',
    desc: n.msg || '',
    time: formatRelTime(n.fecha),
    leida: n.leido ?? false,
    evento_fecha: n.evento_fecha || null,
    evento_nombre: n.evento_nombre || null,
    luchador_nombre: n.luchador_nombre || null,
    _source: 'postulacion',
  }));

  // Merge: postulaciones primero (más recientes), luego sistema
  return [...postulNormalized, ...systemRaw];
};

const saveNotifs = (notifs) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs.filter(n => n._source === 'system').map(({ _source, ...n }) => n))); } catch {}
};

const Notificaciones = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifs, setNotifs] = useState(loadNotifs);

  // Recargar cuando hay una actualización externa (ej: agrupación acepta postulación)
  useEffect(() => {
    const onUpdate = () => setNotifs(loadNotifs());
    window.addEventListener('notifs-updated', onUpdate);
    return () => window.removeEventListener('notifs-updated', onUpdate);
  }, []);

  const update = (next) => {
    setNotifs(next);
    saveNotifs(next);
    const noLeidas = next.filter(n => !n.leida).length;
    localStorage.setItem('sportshausen_notifs_unread', String(noLeidas));
    window.dispatchEvent(new Event('notifs-updated'));
  };

  const marcarTodas = () => {
    const userId = getUserId();
    const userType = getUserType();
    const next = notifs.map(n => ({ ...n, leida: true }));
    // Marcar también las de postulaciones en su propia clave (según rol)
    if (userId) {
      const storageKey = userType === 'agrupacion'
        ? `${AGRUPACION_NOTIF_PREFIX}${userId}`
        : `${LUCHADOR_NOTIF_PREFIX}${userId}`;
      const pendPostul = next.filter(n => n._source === 'postulacion');
      try {
        localStorage.setItem(storageKey, JSON.stringify(pendPostul.map(n => ({
          id: n.id, msg: n.desc, leido: true,
          tipo: n.tipo, evento_fecha: n.evento_fecha, evento_nombre: n.evento_nombre,
          luchador_nombre: n.luchador_nombre,
        }))));
      } catch {}
    }
    update(next);
  };

  const marcarLeida = (id) => {
    const notif = notifs.find(n => n.id === id);
    if (notif?._source === 'postulacion') {
      const uid = getUserId();
      const utype = getUserType();
      if (uid) {
        if (utype === 'agrupacion') {
          // Marcar leída en clave de agrupación
          const key = `${AGRUPACION_NOTIF_PREFIX}${uid}`;
          try {
            const all = JSON.parse(localStorage.getItem(key) || '[]');
            localStorage.setItem(key, JSON.stringify(all.map(n => n.id === id ? { ...n, leido: true } : n)));
          } catch {}
        } else {
          marcarNotificacionLeida(uid, id);
        }
      }
    }
    update(notifs.map(n => n.id === id ? { ...n, leida: true } : n));
  };

  const noLeidas = notifs.filter(n => !n.leida).length;

  return (
    <div className="min-h-screen bg-sportshausen-light">
      <Header userType={getUserType()} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex pt-16 min-h-screen">
        <SideNav active="notifications" onSelect={() => {}} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-8 py-10 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-display font-black text-sportshausen-dark mb-2">Notificaciones</h1>
              <p className="text-gray-600">{noLeidas > 0 ? `${noLeidas} sin leer` : 'Todo al día'}</p>
            </div>
            {noLeidas > 0 && (
              <button onClick={marcarTodas} className="btn-outline text-sm px-4 py-2">Marcar todas como leídas</button>
            )}
          </div>

          <div className="space-y-3 max-w-2xl">
            {notifs.map(n => {
              const Icon = iconMap[n.tipo] || Bell;
              return (
                <div
                  key={n.id}
                  onClick={() => marcarLeida(n.id)}
                  className={`bg-white rounded-2xl p-5 card-shadow flex gap-4 items-start cursor-pointer transition-all hover:shadow-md ${!n.leida ? 'border-l-4 border-sportshausen-red' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorMap[n.tipo] || 'bg-gray-400'}`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-sportshausen-dark text-sm">{n.titulo}</p>
                      {!n.leida && <span className="w-2 h-2 bg-sportshausen-red rounded-full flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{n.desc}</p>
                    {n.tipo === 'postulacion_aceptada' && n.evento_fecha && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        <Calendar size={11} />
                        Fecha marcada en tu calendario
                      </span>
                    )}
                    {n.tipo === 'nueva_postulacion' && n.luchador_nombre && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        👤 {n.luchador_nombre}
                      </span>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Notificaciones;
