import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, usersAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // sessionStorage se limpia al cerrar el navegador
    const savedToken = sessionStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');

    // JWT usa base64url, no base64 estándar — hay que normalizar antes de atob()
    const isOurJWT = (() => {
      if (!savedToken) return false;
      try {
        const b64 = savedToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = b64.padEnd(b64.length + (4 - b64.length % 4) % 4, '=');
        const payload = JSON.parse(atob(padded));
        if (!payload.xanoToken) return false;
        if (payload.exp && payload.exp * 1000 < Date.now()) return false;
        return true;
      } catch { return false; }
    })();

    if (isOurJWT) {
      setToken(savedToken);
    } else if (savedToken) {
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
    }

    const normalizeUser = (u) => {
      if (!u) return u;
      return { ...u, displayName: u.full_name || null };
    };

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (!parsedUser.role && savedUserType) {
          parsedUser.role = savedUserType;
        }
        const normalized = normalizeUser(parsedUser);
        setUser(normalized);
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);

      const data = response.data || response;
      const authToken = data.authToken || data.token;
      let userData = data.user || data;

      let userRole = userData.role || userData.tipo_usuario || userData.type || 'luchador';
      if (userRole === 'agrupación') userRole = 'agrupacion';
      if (!['booker', 'agrupacion', 'luchador'].includes(userRole)) userRole = 'luchador';
      userData.role = userRole;

      localStorage.removeItem('sportshausen_notifs');
      localStorage.removeItem('sportshausen_notifs_unread');

      sessionStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userType', userRole);
      localStorage.setItem('userId', userData.id || userData.user_id);

      setToken(authToken);
      setUser(userData);

      try {
        const hasFullName = !!(userData.full_name);
        const uid = userData.id || userData.user_id || localStorage.getItem('userId');
        if (!hasFullName && uid) {
          localStorage.setItem('authToken', authToken);
          const profileResp = await usersAPI.getProfileById(uid);
          const profileData = profileResp || {};
          if (profileData && profileData.full_name) {
            userData = { ...userData, ...profileData };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
          }
        }
      } catch (e) {
        console.warn('No se pudo obtener perfil adicional tras login:', e);
      }

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, role = 'luchador') => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.signup(name, email, password, role);

      const data = response.data || response;
      const authToken = data.authToken || data.token;
      let userData = data.user || data;

      let userRole = userData.role || userData.tipo_usuario || userData.type || role || 'luchador';
      if (userRole === 'agrupación') userRole = 'agrupacion';
      if (!['booker', 'agrupacion', 'luchador'].includes(userRole)) userRole = 'luchador';
      userData.role = userRole;

      sessionStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userType', userRole);
      localStorage.setItem('userId', userData.id || userData.user_id);

      setToken(authToken);
      setUser(userData);

      try {
        const hasFullName = !!(userData.full_name);
        const uid = userData.id || userData.user_id || localStorage.getItem('userId');
        if (!hasFullName && uid) {
          sessionStorage.setItem('authToken', authToken);
          const profileResp = await usersAPI.getProfileById(uid);
          const profileData = profileResp || {};
          if (profileData && profileData.full_name) {
            userData = { ...userData, ...profileData };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
          }
        }
      } catch (e) {
        console.warn('No se pudo obtener perfil adicional tras signup:', e);
      }

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      localStorage.removeItem('sportshausen_notifs');
      localStorage.removeItem('sportshausen_notifs_unread');

      setToken(null);
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, isAuthenticated, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
