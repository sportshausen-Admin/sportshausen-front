const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '');

const headers = () => {
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  return {
    'Content-Type': 'application/json',
    ...(token    ? { Authorization: `Bearer ${token}` } : {}),
    ...(userId   ? { 'X-User-Id': userId }               : {}),
    ...(userType ? { 'X-User-Role': userType }           : {})
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Error ${response.status}`);
  }
  return response.json();
};

// ==================
// LUCHADOR ENDPOINTS
// ==================

export const crearTicket = (datos) =>
  fetch(`${BASE}/api/tickets`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(datos)
  }).then(handleResponse);

export const misTickets = () =>
  fetch(`${BASE}/api/tickets/mis-tickets`, {
    headers: headers()
  }).then(handleResponse);

export const enviarMensajeLuchador = (ticketId, datos) =>
  fetch(`${BASE}/api/tickets/${ticketId}/mensaje`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(datos)
  }).then(handleResponse);

// ==================
// AGRUPACION ENDPOINTS
// ==================

export const ticketsAgrupacion = () =>
  fetch(`${BASE}/api/tickets/agrupacion/mis-solicitudes`, {
    headers: headers()
  }).then(handleResponse);

export const cambiarPrioridad = (ticketId, prioridad) =>
  fetch(`${BASE}/api/tickets/${ticketId}/prioridad`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ prioridad })
  }).then(handleResponse);

export const enviarMensajeAgrupacion = (ticketId, datos) =>
  fetch(`${BASE}/api/tickets/${ticketId}/mensaje-admin`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(datos)
  }).then(handleResponse);

export const finalizarTicket = (ticketId) =>
  fetch(`${BASE}/api/tickets/${ticketId}/finalizar`, {
    method: 'PATCH',
    headers: headers()
  }).then(handleResponse);

// ==================
// AMBOS ENDPOINTS
// ==================

export const obtenerMensajes = (ticketId) =>
  fetch(`${BASE}/api/tickets/${ticketId}/mensajes`, {
    headers: headers()
  }).then(handleResponse);
