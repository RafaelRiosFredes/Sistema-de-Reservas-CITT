import axios from 'axios';

/**
 * Configuración centralizada de Axios.
 * Se encarga de la URL base y de inyectar el token JWT en las cabeceras.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de solicitudes:
 * Antes de enviar cualquier petición, verifica si existe un token en el localStorage.
 * Si existe, lo añade a la cabecera Authorization.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas:
 * Permite manejar errores globales, como el error 401 (No autorizado).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si el token es inválido o ha expirado, podemos limpiar el almacenamiento
      console.warn('Sesión no autorizada o expirada.');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
