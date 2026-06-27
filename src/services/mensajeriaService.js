const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '');

const headers = () => {
  const token = localStorage.getItem('authToken');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

const handle = async (res) => {
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};

export const getConversaciones = () =>
  fetch(`${BASE}/api/mensajes/conversaciones`, { headers: headers() }).then(handle);

export const getConversacion = (id) =>
  fetch(`${BASE}/api/mensajes/conversaciones/${id}`, { headers: headers() }).then(handle);

export const crearConversacion = (usuario_2_id) =>
  fetch(`${BASE}/api/mensajes/conversaciones`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ usuario_2_id })
  }).then(handle);

export const enviarMensaje = (conversacion_id, contenido) =>
  fetch(`${BASE}/api/mensajes`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ conversacion_id, contenido })
  }).then(handle);

export const marcarLeidos = (conversacion_id) =>
  fetch(`${BASE}/api/mensajes/leer`, {
    method: 'PATCH', headers: headers(), body: JSON.stringify({ conversacion_id })
  }).then(handle);
