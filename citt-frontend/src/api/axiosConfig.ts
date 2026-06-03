import axios from 'axios';

/**
 * Configuración centralizada de Axios.
 * El backend usa arquitectura de Doble Cookie:
 * - auth_token (1 hora): cookie HttpOnly para el access token
 * - refresh_token (7 días): cookie HttpOnly para renovar la sesión
 * Por eso usamos withCredentials: true para que el navegador
 * envíe las cookies automáticamente en cada petición.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ← CLAVE: envía las cookies en cada petición
});

/**
 * Interceptor de respuestas:
 * Maneja errores globales.
 * - 401: sesión expirada o no autorizado
 * - 403: debe cambiar contraseña provisional
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Sesión no autorizada o expirada.');
    }
    return Promise.reject(error);
  }
);

export default api;