const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '');

const authHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const http = async (path, options = {}) => {
  const res = await fetch(`${BASE}/api/eventos${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader(), ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body.message || body.error || JSON.stringify(body) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

// ── Conversión de fecha ──────────────────────────────────────────────────────

const fechaObjToMs = ({ date, month, year }) =>
  new Date(year, month, date, 12, 0, 0).getTime();

const msToFechaObj = (ms) => {
  const d = new Date(typeof ms === 'number' ? ms : Number(ms));
  return { date: d.getDate(), month: d.getMonth(), year: d.getFullYear() };
};

// ── Mapeo de campos ──────────────────────────────────────────────────────────

const fromXano = (r) => ({
  id:            r.id,
  nombre:        r.nombre,
  duracion:      r.duracion,
  horaInicio:    r.hora_inicio,
  horaFin:       r.hora_fin,
  luchadores:    r.luchadores ?? r.vacantes,
  fecha:         msToFechaObj(r.fecha),
  agrupacion_id: r.agrupacion_id ?? 0,
});

const getAgrupacionId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || Number(localStorage.getItem('userId')) || 0;
  } catch { return 0; }
};

const toXano = (ev) => ({
  nombre:        ev.nombre,
  duracion:      ev.duracion,
  hora_inicio:   ev.horaInicio,
  luchadores:    ev.luchadores,
  fecha:         fechaObjToMs(ev.fecha),
  agrupacion_id: getAgrupacionId(),
});

// ── Endpoints ────────────────────────────────────────────────────────────────

export const getEventos = () =>
  http('').then((data) => {
    const items = Array.isArray(data) ? data : (data?.items ?? []);
    return items.map(fromXano);
  });

export const crearEvento = async (ev) => {
  await http('', { method: 'POST', body: JSON.stringify(toXano(ev)) });
  return getEventos();
};

export const actualizarEvento = async (id, ev) => {
  await http(`/${id}`, { method: 'PUT', body: JSON.stringify(toXano(ev)) });
  return getEventos();
};

export const eliminarEvento = (id) =>
  http(`/${id}`, { method: 'DELETE' });
