import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gestion-reservas-e-inventario-citt.onrender.com/api',
  // Obligatorio para enviar y recibir cookies entre frontend y backend
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =================================================================
// BANDERAS PARA LA COLA DE PETICIONES (Evita bucles infinitos)
// =================================================================
let isRefreshing = false;
let failedQueue: any[] = [];

// Procesa todas las peticiones que quedaron en espera mientras se refrescaba el token
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// =================================================================
// 1. INTERCEPTOR DE PETICIONES (REQUEST)
// =================================================================
api.interceptors.request.use(
  (config) => {
    // Redirige /auth/perfil al endpoint real del backend
    if (config.url && config.url.includes('/auth/perfil')) {
      config.url = config.url.replace('/auth/perfil', '/usuarios/mi-perfil');
    }

    // Adjunta el token JWT automáticamente en cada petición si existe en localStorage
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =================================================================
// 2. INTERCEPTOR DE RESPUESTAS (RESPONSE)
// =================================================================
api.interceptors.response.use(
  (response) => {
    // Al hacer login exitoso, guardamos el token y los roles en localStorage
    if (response.config.url?.includes('/auth/login') && response.status === 200) {
      const data = response.data;
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.email || '');
        localStorage.setItem('userRoles', JSON.stringify(data.roles || []));

        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el servidor responde con 401 o 403, intentamos refrescar el token
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {

      // No interceptamos si el error viene del login o del propio endpoint de refresco
      // Tampoco interceptamos si el error es por contraseña provisional (ACCESO_DENEGADO)
      const errorDataStr = JSON.stringify(error.response?.data || {});

      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refrescar-token') ||
        errorDataStr.includes('ACCESO_DENEGADO') ||
        errorDataStr.includes('Debe cambiar su contrase')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Si ya hay un refresco en progreso, ponemos esta petición en espera
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');

        // Pedimos un nuevo access token usando el refresh token guardado
        const refreshResponse = await axios.post('https://gestion-reservas-e-inventario-citt.onrender.com/api/auth/refrescar-token', {
          refreshToken: storedRefreshToken
        }, { withCredentials: true });

        // Guardamos el nuevo token en localStorage
        if (refreshResponse.data && refreshResponse.data.token) {
          localStorage.setItem('token', refreshResponse.data.token);
        }

        // Procesamos las peticiones que estaban esperando
        processQueue(null);

        // Reintentamos la petición original que había fallado
        return api(originalRequest);

      } catch (refreshError) {
        // Si el refresh token también falló, limpiamos la sesión y redirigimos al login
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;