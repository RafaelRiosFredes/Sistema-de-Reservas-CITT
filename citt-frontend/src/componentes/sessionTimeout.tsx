import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Boton from './Boton';
import { AlertTriangle } from 'lucide-react';
import api from '../api/axiosConfig';

// TIEMPO ORIGINAL - ESTE DE DEBE QUEDAR!!
const WARNING_TIME = 25 * 60 * 1000; // 25 minutos
const LOGOUT_TIME = 30 * 60 * 1000; // 30 minutos

// PARA PRUEBAS
// const WARNING_TIME = 5 * 1000; // 5 segundos
// const LOGOUT_TIME = 10 * 1000; // 10 segundos


const SessionTimeout: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const lastActivityTime = useRef<number>(Date.now());
  const timerIntervalRef = useRef<number | null>(null);
  // Si estamos en la página de login, no registramos inactividad ni forzamos cierre
  const isExcludedPage = location.pathname === '/' || location.pathname === '/login';
  const resetActivity = useCallback(() => {
    if (isExcludedPage) return;
    lastActivityTime.current = Date.now();

    // Si el modal de advertencia estaba abierto y el usuario hace algo (ej: click en el botón), lo cerramos
    if (showModal) {
      setShowModal(false);
    }
  }, [isExcludedPage, showModal]);
  const handleLogout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Error al cerrar sesión por inactividad", error);
    } finally {
      // Independientemente de si la API falló (ej: token ya expirado), limpiamos y redirigimos
      localStorage.clear();
      navigate('/');
    }
  }, [navigate]);
  useEffect(() => {
    if (isExcludedPage) {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
      return;
    }
    // Inicializar el tiempo de actividad al entrar a una página protegida
    lastActivityTime.current = Date.now();
    // Eventos a escuchar para resetear el temporizador
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetActivity));
    // Revisar inactividad cada 10 segundos
    timerIntervalRef.current = window.setInterval(() => {
      const currentTime = Date.now();
      const inactiveDuration = currentTime - lastActivityTime.current;
      if (inactiveDuration >= LOGOUT_TIME) {
        handleLogout();
      } else if (inactiveDuration >= WARNING_TIME && !showModal) {
        setShowModal(true);
      }
    }, 10000); // cambiar a 1000 si se quiere probar con el tiempo de pruebas de lo contrario SIEMPRE DEJAR EN 10000
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetActivity));
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
    };
  }, [isExcludedPage, resetActivity, handleLogout, showModal]);
  return (
    <Modal
      isOpen={showModal}
      onClose={resetActivity}
      titulo="¿Sigues ahí?"
      icono={<AlertTriangle className="text-warning" />}
    >
      <p className="text-gray-600 mb-6">
        Por seguridad, tu sesión se cerrará automáticamente en unos minutos debido a inactividad. ¿Deseas continuar navegando?
      </p>
      <div className="flex justify-center">
        <Boton variante="primario" bloque onClick={resetActivity}>
          Seguir navegando
        </Boton>
      </div>
    </Modal>
  );
};
export default SessionTimeout;
