const KEY = 'sh_postulaciones';

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
};
const write = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export const crearPostulacion = (data) => {
  const all = read();
  if (all.some(p => String(p.luchador_id) === String(data.luchador_id) && p.evento_id === data.evento_id)) {
    throw new Error('Ya te has postulado a este evento');
  }
  const nueva = { ...data, id: Date.now(), estado: 'PENDIENTE', fecha: new Date().toISOString() };
  write([...all, nueva]);
  return nueva;
};

export const getPostulacionesAgrupacion = (agrupacionId) =>
  read().filter(p => String(p.agrupacion_id) === String(agrupacionId));

export const getPostulacionesLuchador = (luchadorId) =>
  read().filter(p => String(p.luchador_id) === String(luchadorId));

export const aceptarPostulacion = (id) => {
  const all = read().map(p => p.id === id ? { ...p, estado: 'ACEPTADA' } : p);
  write(all);
  return all.find(p => p.id === id);
};

export const rechazarPostulacion = (id) => {
  const all = read().map(p => p.id === id ? { ...p, estado: 'RECHAZADA' } : p);
  write(all);
  return all.find(p => p.id === id);
};

// ── Notificaciones de agrupación ────────────────────────────────────────────
const AGRUPACION_NOTIF_KEY = (id) => `sh_notificaciones_agrupacion_${id}`;

export const agregarNotificacionAgrupacion = (agrupacionId, msg, extras = {}) => {
  const key = AGRUPACION_NOTIF_KEY(agrupacionId);
  const all = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
  localStorage.setItem(key, JSON.stringify([
    { id: Date.now(), msg, fecha: new Date().toISOString(), leido: false, ...extras },
    ...all,
  ]));
  window.dispatchEvent(new Event('notifs-updated'));
};

export const getNotificacionesAgrupacion = (agrupacionId) => {
  const key = AGRUPACION_NOTIF_KEY(agrupacionId);
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
};

// ── Notificaciones del luchador ──────────────────────────────────────────────
const NOTIF_KEY = 'sh_notificaciones_luchador';
export const agregarNotificacionLuchador = (luchadorId, msg, extras = {}) => {
  const key = `${NOTIF_KEY}_${luchadorId}`;
  const all = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
  localStorage.setItem(key, JSON.stringify([
    { id: Date.now(), msg, fecha: new Date().toISOString(), leido: false, ...extras },
    ...all,
  ]));
  window.dispatchEvent(new Event('notifs-updated'));
};
export const getNotificacionesLuchador = (luchadorId) => {
  const key = `${NOTIF_KEY}_${luchadorId}`;
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
};
export const marcarNotificacionLeida = (luchadorId, id) => {
  const key = `${NOTIF_KEY}_${luchadorId}`;
  const all = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
  localStorage.setItem(key, JSON.stringify(all.map(n => n.id === id ? { ...n, leido: true } : n)));
};

// Marcas pendientes en el calendario del luchador
const PENDING_CAL_KEY = (id) => `sh_pending_calendar_${id}`;
export const addPendingCalendarMark = (luchadorId, fechaStr, razon) => {
  const key = PENDING_CAL_KEY(luchadorId);
  const all = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
  localStorage.setItem(key, JSON.stringify([...all, { id: Date.now(), fechaStr, razon }]));
};
export const getPendingCalendarMarks = (luchadorId) => {
  const key = PENDING_CAL_KEY(luchadorId);
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
};
export const removePendingCalendarMark = (luchadorId, id) => {
  const key = PENDING_CAL_KEY(luchadorId);
  const all = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
  localStorage.setItem(key, JSON.stringify(all.filter(m => m.id !== id)));
};
