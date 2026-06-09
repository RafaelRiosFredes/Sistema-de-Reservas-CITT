import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  // ESTO ES OBLIGATORIO para enviar y recibir cookies (rama login-frontend)
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
// 1. INTERCEPTOR DE PETICIONES (REQUEST) - TU LÓGICA
// =================================================================
api.interceptors.request.use(
  (config) => {
    // RE-DIRECCIÓN DINÁMICA: Cambia /auth/perfil por el endpoint real del backend
    if (config.url && config.url.includes('/auth/perfil')) {
      config.url = config.url.replace('/auth/perfil', '/usuarios/mi-perfil');
    }

    // INYECCIÓN DE CREDENCIALES: Adjunta el token JWT automáticamente si existe
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
// 2. INTERCEPTOR DE RESPUESTAS (RESPONSE) - LÓGICA COMBINADA
// =================================================================
api.interceptors.response.use(
  (response) => {
    // CAPTURA AUTOMÁTICA DEL LOGIN: Guarda el token y los roles devueltos por el backend
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

    // Control de expiración o denegación de accesos (401 o 403)
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      
      console.log('AXIOS INTERCEPTOR CAUGHT 401/403:', originalRequest.url, error.response?.data);

      // Evitar interceptar las llamadas al login o al propio endpoint de refresco
      // TAMBIÉN evitamos interceptar cuando es un ACCESO_DENEGADO (ej: por clave provisoria)
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
        // Si ya hay un refresco en progreso, ponemos esta petición en cola
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
        
        // Llamada a la API para refrescar el token usando tu lógica de envío en el body
        const refreshResponse = await axios.post('http://localhost:8080/api/auth/refrescar-token', {
          refreshToken: storedRefreshToken
        }, { withCredentials: true });
        
        // Actualizamos el token nuevo en el localStorage
        if (refreshResponse.data && refreshResponse.data.token) {
          localStorage.setItem('token', refreshResponse.data.token);
        }

        // Si funciona, procesamos la cola de peticiones que estaban esperando
        processQueue(null);
        
        // Y reintentamos la petición original que falló
        return api(originalRequest);
        
      } catch (refreshError) {
        // Si el refresh token también falló (expiró o cerró sesión)
        processQueue(refreshError, null);
        localStorage.clear();
        // Opcional: Redirigir al usuario al login forzosamente
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