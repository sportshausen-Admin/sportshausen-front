const _raw = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_BASE_URL = _raw.replace(/\/api\/?$/, '').replace(/\/$/, '') + '/api';


/**
 * Realizar una llamada a la API
 */
const apiCall = async (endpoint, options = {}) => {
  const { method = 'GET', body = null, headers = {} } = options;

  const requestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // Agregar token si existe
  const token = localStorage.getItem('authToken');
  if (token) {
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  // Agregar body si existe
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Auth API calls
 */
export const authAPI = {
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  signup: (name, email, password, role = 'luchador') =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: { name, email, password, role },
    }),

  logout: () =>
    apiCall('/auth/logout', {
      method: 'POST',
    }),
};

/**
 * Users API calls
 */
export const usersAPI = {
  getAll: () => apiCall('/users'),

  getById: (id) => apiCall(`/users/${id}`),

  // Endpoint proxy for profile (backend provides /api/profile/:id)
  getProfileById: (id) => apiCall(`/profile/${id}`),

  create: (userData) =>
    apiCall('/users', {
      method: 'POST',
      body: userData,
    }),

  update: (id, userData) =>
    apiCall(`/profile/${id}`, {
      method: 'PATCH',
      body: userData,
    }),

  delete: (id) =>
    apiCall(`/users/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * Emails API calls
 */
export const emailsAPI = {
  sendWelcome: (userId) =>
    apiCall('/emails/welcome', {
      method: 'POST',
      body: { user_id: userId },
    }),
};

export default apiCall;
