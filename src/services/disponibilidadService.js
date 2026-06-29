const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '');

const headers = () => {
  const token = sessionStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handle = async (res) => {
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try { const b = await res.json(); msg = b?.message || b?.error || msg; } catch {}
    throw new Error(msg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

export const getFechas = () =>
  fetch(`${BASE}/api/disponibilidad`, { headers: headers() }).then(handle);

export const upsertFecha = (fecha, status, razon = '') =>
  fetch(`${BASE}/api/disponibilidad`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ fecha, status, razon }),
  }).then(handle);

export const deleteFecha = (fecha) =>
  fetch(`${BASE}/api/disponibilidad/${fecha}`, {
    method: 'DELETE',
    headers: headers(),
  }).then(handle);
